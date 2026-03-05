<template>
    <div class="container">
        <div class="title">{{ $t('en_de.title')}}</div>
        <div class="select-wrapper">
            <!-- Replace el-select with el-radio-group -->
            <el-radio-group v-model="selectedMethod">
                <el-radio value="base64">Base64</el-radio>
                <el-radio value="url">URL</el-radio>
                <el-radio value="hex">Hex</el-radio>
                <el-radio value="utf8">UTF-8</el-radio> <!-- Added UTF-8 option -->
                <el-radio value="unicode">Unicode</el-radio> <!-- Added Unicode option -->
            </el-radio-group>
        </div>
        <div class="input-area">
            <el-input v-model="inputText" type="textarea" :placeholder="$t('en_de.placeholder.input')" :rows="4" />
        </div>


        <div class="buttons-wrapper">
            <el-button type="primary" class="encode-btn" @click="encode">{{ $t('en_de.encode') }}</el-button>
            <el-button type="success" class="decode-btn" @click="decode">{{ $t('en_de.decode') }}</el-button>
        </div>

        <CopyTextarea v-model="outputText" type="textarea" :placeholder="$t('en_de.placeholder.output')" :rows="4" readonly
            class="output-area" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import CopyTextarea from './component/copy_textarea.vue';
// import { trackEvent } from '@/utils/use-analytics';
const inputText = ref('');
const outputText = ref('');
const selectedMethod = ref('base64');


const encode = () => {
    switch (selectedMethod.value) {
        case 'base64':
           // Convert the input text to a UTF-8 encoded string
           const utf8Bytes = new TextEncoder().encode(inputText.value);
            // Convert the byte array to a binary string
            const binaryString = Array.from(utf8Bytes).map(byte => String.fromCharCode(byte)).join('');
            // Encode the binary string to Base64
            outputText.value = btoa(binaryString); // Base64 encode
            break;
        case 'url':
            outputText.value = encodeURIComponent(inputText.value); // URL encode
            break;
        case 'hex':
            outputText.value = '0x' + inputText.value.split('').map(char => char.charCodeAt(0).toString(16)).join(''); // Hex encode
            break;
        case 'utf8':
            const encoder = new TextEncoder(); // Create a new TextEncoder instance
            const encoded = encoder.encode(inputText.value); // Encode input text to UTF-8
            outputText.value = '0x'+Array.from(encoded).map(byte => byte.toString(16).padStart(2, '0')).join(''); // Convert to hex string
            break;
        case 'unicode':
            outputText.value = inputText.value.split('').map(char => '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4)).join(''); // Unicode encode
            break;
        default:
            outputText.value = 'Please select the coding method';
    }
    //trackEvent('Buttons', 'ToggleClick', selectedMethod.value + ' encode');
};

const decode = () => {
    switch (selectedMethod.value) {
        case 'base64':
            // Decode the Base64 string to a binary string
            const binaryString = atob(inputText.value);
            // Convert the binary string to a byte array
            const b64_bytes = new Uint8Array(binaryString.split('').map(char => char.charCodeAt(0)));
            // Decode the byte array to a UTF-8 string
            const b64_decoder = new TextDecoder('utf-8'); // Create a new TextDecoder instance
            outputText.value = b64_decoder.decode(b64_bytes); // Decode byte array to UTF-8 string
            break;
        case 'url':
            outputText.value = decodeURIComponent(inputText.value); // URL decode
            break;
        case 'hex':
            outputText.value = inputText.value.match(/.{1,2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join(''); // Hex decode
            break;
        case 'utf8':
            const bytes = new Uint8Array(inputText.value.match(/.{1,2}/g).map(byte => parseInt(byte, 16))); // Convert hex to byte array
            const decoder = new TextDecoder('utf-8'); // Create a new TextDecoder instance
            outputText.value = decoder.decode(bytes); // Decode byte array to UTF-8 string
            break;
        case 'unicode':
            outputText.value = inputText.value.replace(/\\u([\d\w]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16))); // Unicode decode
            break;
        default:
            outputText.value = 'Please select the decoding method';
    }
    //trackEvent('Buttons', 'ToggleClick', selectedMethod.value + ' decode');
};
</script>

<style scoped>
/* Container for the entire layout */

/* Select dropdown wrapper */
.select-wrapper {
     /* background-color: #fff; */
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
}

/* Input text areas */
.input-area,
.output-area {
    width: 100%;
    margin-bottom: 20px;
    /* margin-right: 20px; */
    border-radius: 8px;
    border: 1px solid #e1e1e1;
    padding: 12px;
    font-size: 18px;
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.05);
    transition: border 0.2s ease;
}

.input-area:focus,
.output-area:focus {
    border-color: #007aff;
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.1);
}

/* Buttons wrapper */
.buttons-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

/* Primary encode button */
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

/* Responsive styling for smaller screens */
@media (max-width: 600px) {
    .buttons-wrapper {
        flex-direction: column;
    }

    .encode-btn,
    .decode-btn {
        width: 100%;
    }
}
</style>