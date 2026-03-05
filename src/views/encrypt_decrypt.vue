<template>
  <div class="container">
    <div class="title">{{ $t('sy_en.title') }}</div>
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('sy_en.encryptionSettings') }}</span>
        </div>
      </template>
      <div class="settings">

        <el-select v-model="keyGenMethod" placeholder="Select method" class="settings-item method-select">
          <el-option label="AES-256" value="AES"></el-option>
          <el-option label="SM4" value="SM4"></el-option>
        </el-select>
        <el-select v-model="selectedMode" placeholder="Select AES mode" class="settings-item mode-select">
          <el-option v-for="mode in filteredEncryptionModes" :key="mode.value" :label="mode.label" :value="mode.value" />
        </el-select>

        <el-input v-model="secretKey" :placeholder="keyPlaceholder" :maxlength="maxKeyLength" show-word-limit
          class="settings-item key-input">
          <template #prefix>
            <el-icon>
              <Key />
            </el-icon>
          </template>
        </el-input>
      </div>
    </el-card>
    <div class="content">
      <el-card class="input-card">
        <template #header>
          <div class="card-header">
            <span>{{ $t('sy_en.input') }}</span>
          </div>
        </template>
        <CopyTextarea v-model="inputText" :rows="4" :placeholder="$t('sy_en.input_placeholer')" />
      </el-card>
      <div class="buttons">
        <el-button type="primary" class="encode-btn" @click="encrypt" icon="Lock">{{ $t('encrypt') }}</el-button>
        <el-button type="success" class="decode-btn" @click="decrypt" icon="Unlock">{{ $t('decrypt') }}</el-button>
      </div>
      <el-card class="output-card">
        <template #header>
          <div class="card-header">
            <span>{{ $t('sy_en.output') }}</span>
          </div>
        </template>
        <CopyTextarea v-model="outputText" :rows="4" readonly :placeholder="$t('sy_en.output_placeholder')" />
      </el-card>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
// import CryptoJS from 'crypto-js';
// import { sm4 } from 'sm-crypto';
import { Key } from '@element-plus/icons-vue'
import AES_GCM from '@/utils/aes-gcm.js';
import AES from '@/utils/cryptojs-aes.js';
import SM4 from '@/utils/sm-crypto-sm4.js';
import CopyTextarea from './component/copy_textarea.vue';
// import { trackEvent } from '@/utils/use-analytics';
import { useI18n } from 'vue-i18n'; // Add this import
const inputText = ref('');
const outputText = ref('');
const secretKey = ref('');
const { t } = useI18n();
const selectedMode = ref('GCM');
const keyGenMethod = ref('AES')
const encryptionModes = [
  // GCM CBC CFB OFB CTR ECB
  { label: 'GCM', value: 'GCM' },
  { label: 'CBC', value: 'CBC' },
  { label: 'CFB', value: 'CFB' },
  { label: 'OFB', value: 'OFB' },
  { label: 'CTR', value: 'CTR' },
  { label: 'ECB', value: 'ECB' },
];

const filteredEncryptionModes = computed(() => {
  if (keyGenMethod.value === 'SM4'){
    selectedMode.value = "CBC"
  }

  return keyGenMethod.value === 'SM4'
    ? encryptionModes.filter(mode => mode.value === 'ECB' || mode.value === 'CBC')
    : encryptionModes;
});


function hexToString(hex) {
  // 确保hex字符串长度为32（16字节 * 2字符/字节）
  hex = hex.padEnd(32, '0').slice(0, 32);

  return hex.match(/.{1,2}/g)
    .map(byte => String.fromCharCode(parseInt(byte, 16)))
    .join('');
}

function stringToHexStr(str) {
  // Initialize an empty hex string
  let hex = '';

  // Process up to 16 characters from the input string
  for (let i = 0; i < 16; i++) {
    if (i < str.length) {
      // If the character exists in the input, convert it to hex
      const charCode = str.charCodeAt(i);
      const hexValue = charCode.toString(16);
      hex += hexValue.padStart(2, '0');
    } else {
      // If we've run out of input characters, pad with '00'
      hex += '00';
    }
  }

  // Ensure the hex string is exactly 32 characters long
  hex = hex.padEnd(32, '0').slice(0, 32);

  return hex;
}


const keyPlaceholder = computed(() => {
  return keyGenMethod.value === 'AES'
    ? t('sy_en.aesSecretKey')
    : t('sy_en.sm4SecretKey');
})

const maxKeyLength = computed(() => {
  return keyGenMethod.value === 'AES' ? 32 : 16;
})



const encrypt = async () => {
  if (!inputText.value || !secretKey.value) {
    outputText.value = 'Please enter both text and secret key';
    return;
  }

  try {
    let encrypted;
    if (keyGenMethod.value === 'AES' && selectedMode.value === 'GCM') {
      encrypted = await AES_GCM.encrypt(inputText.value, secretKey.value);
    } else if (keyGenMethod.value === 'AES') {
      // encrypted = CryptoJS.AES.encrypt(inputText.value, secretKey.value, {
      //   mode: CryptoJS.mode[selectedMode.value],
      //   padding: CryptoJS.pad.Pkcs7
      // }).toString();
      encrypted = AES.encrypt(inputText.value, secretKey.value, {
        mode: selectedMode.value,
        padding: 'PKCS7'
      })

    } else if (keyGenMethod.value === 'SM4') {
      // let smKey = stringToHexStr(secretKey.value);
      // encrypted = sm4.encrypt(inputText.value, smKey, {
      //   mode: selectedMode.value.toLowerCase(),
      //   iv: 'b4ebb681624a669c5a0ef0ba4229859b',
      // });
      encrypted = SM4.encrypt(inputText.value, secretKey.value, {
        mode: selectedMode.value,
        padding: 'PKCS7'
      })
    }
    outputText.value = encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    // outputText.value = 'Error: Unable to encrypt. Please check your input and key.';
    outputText.value = `Error: Unable to encrypt. ${error} Please check your input, key, and selected method.`;
  }
  //trackEvent('Buttons', 'ToggleClick', keyGenMethod.value + ' encrypt');
};

const decrypt = async () => {
  if (!inputText.value || !secretKey.value) {
    outputText.value = 'Please enter both text and secret key';
    return;
  }

  try {
    let decrypted;
    if (keyGenMethod.value === 'AES' && selectedMode.value === 'GCM') {
      decrypted = await AES_GCM.decrypt(inputText.value, secretKey.value);
    } else if (keyGenMethod.value === 'AES') {
      // decrypted = CryptoJS.AES.decrypt(inputText.value, secretKey.value, {
      //   mode: CryptoJS.mode[selectedMode.value],
      //   padding: CryptoJS.pad.Pkcs7
      // }).toString(CryptoJS.enc.Utf8);
      decrypted = AES.decrypt(inputText.value, secretKey.value, {
        mode: selectedMode.value,
        padding: 'PKCS7'
      })


    } else if (keyGenMethod.value === 'SM4') {
      // decrypted = sm4.decrypt(inputText.value, stringToHexStr(secretKey.value), {
      //   mode: selectedMode.value.toLowerCase(),
      //   iv: 'b4ebb681624a669c5a0ef0ba4229859b',
      // });

      decrypted = SM4.decrypt(inputText.value, secretKey.value, { mode: selectedMode.value, padding: 'PKCS7' })

    }

    // if (!decrypted) {
    //   throw new Error('Decryption failed');
    // }
    outputText.value = decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    outputText.value = `Error: Unable to decrypt. ${error} Please check your input, key, and selected method.`;
  }
  //trackEvent('Buttons', 'ToggleClick', keyGenMethod.value + ' decrypted');
};
</script>

<style scoped>
.settings-card {
  margin-bottom: 20px;
}

.settings-card,
.input-card,
.output-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background-color: #F7F8FA;
}


.card-header {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.settings {
  display: flex;
  gap: 20px;
  align-items: center;
}

.settings-item {
  min-width: 0;
  /* Prevents flex items from overflowing */
}

.method-select,
.mode-select {
  flex: 0 0 calc(16.67% - 13.33px);
  /* 1/6 of space minus 2/3 of the gap */
}

.key-input {
  flex: 0 0 calc(66.67% - 13.33px);
  /* 2/3 of space minus 2/3 of the gap */
}



.content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.input-card,
.output-card {
  flex: 1 1 calc(50% - 10px);
  min-width: 300px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  margin: 5px 0;
}

/* .buttons .el-button {
  font-size: 1em;
  padding: 10px 20px;
  border-radius: 8px;
} */


.encode-btn {
  width: 120px;
  background-color: #007aff;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.encode-btn:hover {
  background-color: #005bb5;
}

/* Success decode button */
.decode-btn {
  width: 120px;
  background-color: #34c759;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}


.decode-btn:hover {
  background-color: #28a745;
}



:deep(.el-textarea__inner) {
  font-family: 'Courier New', Courier, monospace;
}

@media (max-width: 768px) {
  .settings {
    flex-direction: column;
  }

  .mode-select {
    width: 100%;
  }

  .settings-item {
    width: 100%;
  }

  .input-card,
  .output-card {
    flex: 1 1 100%;
  }
}
</style>
