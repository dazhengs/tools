<template>
    <div class="container">
        <div class="title">{{ $t('rsasm2.title') }}</div>
        <el-tabs type="border-card">
            <el-tab-pane :label="$t('rsasm2.tabs.keyGenerate')">


                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>{{ $t('rsasm2.keyGenerate.generateKeys') }}</span>
                        </div>
                    </template>
                    <el-form>
                        <el-form-item label="Algorithm">
                            <el-radio-group v-model="keyGenMethod">
                                <el-radio value="rsa">RSA-2048</el-radio>
                                <el-radio value="sm2">SM2</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" class="encode-btn" :disabled="isGenerating" @click="generateKeys">{{ $t('rsasm2.keyGenerate.generateButton') }}</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>


                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>{{ $t('rsasm2.keyGenerate.generatedKeys') }}</span>
                        </div>
                    </template>
                    <el-form label-position="top">
                        <el-form-item :label="$t('rsasm2.keyGenerate.publicKey')">
                            <CopyTextarea v-model="generatedPublicKey" placeholder="" type="textarea" :rows="5" readonly />
                        </el-form-item>
                        <el-form-item :label="$t('rsasm2.keyGenerate.privateKey')">
                            <CopyTextarea v-model="generatedPrivateKey"  placeholder=""  type="textarea" :rows="5" readonly>
                            </CopyTextarea>
                        </el-form-item>
                    </el-form>
                </el-card>


            </el-tab-pane>
            <el-tab-pane :label="$t('rsasm2.tabs.encrypt')">

                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>{{ $t('rsasm2.encryption.encryption') }}</span>
                        </div>
                    </template>
                    <el-form label-position="top">
                        <el-form-item :label="$t('rsasm2.encryption.encryptionMethod')">
                            <el-radio-group v-model="encryptionMethod">
                                <el-radio value="rsa">RSA-2048</el-radio>
                                <el-radio value="sm2">SM2</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('rsasm2.encryption.publicKey')">
                            <el-input v-model="pkPublicKey" type="textarea" :rows="4"
                                :placeholder="$t('rsasm2.encryption.placeholder_pk')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('rsasm2.encryption.message')">
                            <CopyTextarea v-model="plaintext" type="textarea" :rows="4"
                            :placeholder="$t('rsasm2.encryption.placeholder_msg')">
                            </CopyTextarea>
                        </el-form-item>
                        <el-form-item>
                            <div class="buttons-wrapper">
                                <el-button type="primary"  class="encode-btn" @click="encrypt" icon="Lock">{{ $t('rsasm2.encryption.encryptButton')}}</el-button>
                            </div>

                        </el-form-item>
                        <el-form-item :label="$t('rsasm2.encryption.encryptedMessage')">
                            <CopyTextarea v-model="encryptedText" type="textarea" :rows="4" placeholder="" readonly></CopyTextarea>
                        
                        </el-form-item>
                    </el-form>
                </el-card>

                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>{{ $t('rsasm2.decryption.decryption') }}</span>
                        </div>
                    </template>
                    <el-form label-position="top">
                        <el-form-item :label="$t('rsasm2.decryption.decryptionMethod')">

                            <el-radio-group v-model="decryptionMethod">
                                <el-radio value="rsa">RSA-2048</el-radio>
                                <el-radio value="sm2">SM2</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('rsasm2.decryption.privateKey')">
                            <el-input v-model="pkPrivateKey" type="textarea" :rows="4"
                                :placeholder="$t('rsasm2.decryption.placeholder_prik')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('rsasm2.decryption.encryptedMessage')">
                            <CopyTextarea v-model="encryptedInput" type="textarea" :rows="4"
                            :placeholder="$t('rsasm2.decryption.placeholder_msg')">
                            </CopyTextarea>
                        </el-form-item>
                        <el-form-item>
                            <div class="buttons-wrapper">
                                <el-button type="success" class="decode-btn" @click="decrypt" icon="Unlock">{{ $t('rsasm2.decryption.decryptButton') }}</el-button>
                            </div>

                        </el-form-item>
                        <el-form-item :label="$t('rsasm2.decryption.decryptedMessage')">
                            <CopyTextarea v-model="decryptedText" :placeholder="$t('rsasm2.decryption.placeholder_decryptedMessage')" type="textarea" :rows="4" readonly>
                            </CopyTextarea>
                        </el-form-item>
                    </el-form>
                </el-card>

            </el-tab-pane>

            <el-tab-pane :label="$t('rsasm2.tabs.signature')">

                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>{{ $t('rsasm2.signature.signature') }}</span>
                        </div>
                    </template>
                    <el-form label-position="top">
                        <el-form-item :label="$t('rsasm2.signature.signatureMethod')">
                            <el-radio-group v-model="encryptionMethod">
                                <el-radio value="rsa">RSA-2048</el-radio>
                                <el-radio value="sm2">SM2</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('privateKey')">
                            <el-input v-model="pkPrivateKey" type="textarea" :rows="4"
                                :placeholder="$t('rsasm2.signature.placeholder_prik')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('rsasm2.signature.message')">
                            <CopyTextarea v-model="message" type="textarea" :rows="4" :placeholder="$t('rsasm2.signature.placeholder_msg')">
                            </CopyTextarea>
                        </el-form-item>
                        <el-form-item>
                            <div class="buttons-wrapper">
                                <el-button type="primary" class="encode-btn" icon="Lock" @click="signature">{{ $t('rsasm2.signature.signatureButton') }}</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item :label="$t('rsasm2.signature.signatureMessage')">
                            <CopyTextarea v-model="signaturedMessage" placeholder="" type="textarea" :rows="4" readonly>
                            </CopyTextarea>
                        </el-form-item>
                    </el-form>
                </el-card>

                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>{{ $t('rsasm2.verification.verification') }}</span>
                        </div>
                    </template>
                    <el-form label-position="top">
                        <el-form-item :label="$t('rsasm2.verification.verificationMethod')">
                            <el-select v-model="decryptionMethod" placeholder="Select method">
                                <el-option label="SM2" value="sm2"></el-option>
                                <el-option label="RSA" value="rsa"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('publicKey')">
                            <el-input v-model="pkPublicKey" type="textarea" :rows="4"
                                :placeholder="$t('rsasm2.verification.placeholder_pk')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('rsasm2.verification.message') ">
                            <el-input v-model="messageInput" type="textarea" :rows="4"
                               :placeholder="$t('rsasm2.verification.placeholder_msg')"></el-input>
                        </el-form-item>

                        <el-form-item :label="$t('rsasm2.verification.signatureMessage') ">
                            <el-input v-model="signaturedMessageInput" type="textarea" :rows="4"
                                :placeholder="$t('rsasm2.verification.placeholder_signatureMessage')"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <div class="buttons-wrapper">
                                <el-button type="success" class="decode-btn" icon="Unlock"
                                    @click="verifySignature">{{ $t('rsasm2.verification.verifySignatureButton') }}</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item :label="$t('rsasm2.verification.verificationResults') ">
                            <el-input v-model="verificationMessage" type="textarea" :rows="1" readonly></el-input>
                            <div v-if="verificationMessage" style="width: 100%;">
                                <el-alert v-if="verificationResults" :title="$t('rsasm2.verification.validSignature')" type="success" show-icon
                                    effect="dark" />
                                <el-alert v-else :title="$t('rsasm2.verification.invalidSignature')" type="error" effect="dark" show-icon />
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>

            </el-tab-pane>

        </el-tabs>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import CopyTextarea from './component/copy_textarea.vue';
// import { trackEvent } from '@/utils/use-analytics';
import { useI18n } from 'vue-i18n'; // Add this import
const {t} = useI18n();
// Import encryption libraries (you'll need to add these to your project)
import { sm2 } from 'sm-crypto'
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt'

const keyGenMethod = ref('rsa')
const generatedPublicKey = ref('')
const generatedPrivateKey = ref('')

const encryptionMethod = ref('rsa')
const decryptionMethod = ref('rsa')
const plaintext = ref('')
const encryptedText = ref('')
const encryptedInput = ref('')
const decryptedText = ref('')
const pkPublicKey = ref('')
const pkPrivateKey = ref('')

const message = ref('')
const signaturedMessage = ref('')

const messageInput = ref('')
const signaturedMessageInput = ref('')

const verificationMessage = ref('')
const verificationResults = ref('false')

const isGenerating = ref(false); // Add a loading state
const logWithTimestamp = (message) => {
    const timestamp = new Date().toISOString(); // Get current timestamp in ISO format
    console.log(`[${timestamp}] ${message}`);
};
const generateKeys = () => {
    if (isGenerating.value) {
        ElMessage.warning('Key generation is already in progress. Please wait.'); // Alert the user
        return; // Prevent further execution
    }
    //trackEvent('Buttons', 'ToggleClick', 'generateKeys');
    isGenerating.value = true; // Set loading state to true
    // Use setTimeout to simulate async behavior

    try {
        if (keyGenMethod.value === 'sm2') {
            // Implement SM2 key generation
            const { publicKey, privateKey } = sm2.generateKeyPairHex();
            generatedPublicKey.value = publicKey;
            generatedPrivateKey.value = privateKey;
        } else {
            // Implement RSA key generation
            const jsEncrypt = new JSEncrypt({ default_key_size: 2048 });

            generatedPublicKey.value = jsEncrypt.getPublicKey();

            generatedPrivateKey.value = jsEncrypt.getPrivateKey();

        }
        pkPublicKey.value = generatedPublicKey.value;
        pkPrivateKey.value = generatedPrivateKey.value;
        encryptionMethod.value = keyGenMethod.value;
        decryptionMethod.value = keyGenMethod.value;
        ElMessage.success(t('rsasm2.keyGenerate.elmsg_succ'));


    } catch (error) {
        ElMessage.error('Key generation failed: ' + error.message);
    } finally {
        // 
        setTimeout(() => {
            isGenerating.value = false; // Reset loading state
        }, 3000)
    }

}

const encrypt = () => {
    try {
        if (encryptionMethod.value === 'sm2') {
            // Implement SM2 encryption
            encryptedText.value = sm2.doEncrypt(plaintext.value, pkPublicKey.value)
            // encryptedText.value = 'SM2 Encrypted: ' + plaintext.value // Placeholder
        } else {
            // Implement RSA encryption
            const encrypt = new JSEncrypt()
            encrypt.setPublicKey(pkPublicKey.value)
            encryptedText.value = encrypt.encrypt(plaintext.value)
            // encryptedText.value = 'RSA Encrypted: ' + plaintext.value // Placeholder
        }
        ElMessage.success('Encryption successful')
    } catch (error) {
        ElMessage.error('Encryption failed: ' + error.message)
    }
    //trackEvent('Buttons', 'ToggleClick', encryptionMethod.value + ' encrypt');
}

const signature = () => {
    try {
        if (encryptionMethod.value === 'sm2') {
            // Implement SM2 signing
            // Note: sm2.doSignature requires a private key for signing
            const signatureResult = sm2.doSignature(message.value, pkPrivateKey.value);
            signaturedMessage.value = signatureResult;
        } else {
            // Implement RSA signing
            const sign = new JSEncrypt();
            sign.setPrivateKey(pkPrivateKey.value);
            const signatureResult = sign.sign(message.value, CryptoJS.SHA256, "sha256");
            signaturedMessage.value = signatureResult;
        }
        ElMessage.success('Signature successful');
    } catch (error) {
        ElMessage.error('Signature failed: ' + error.message);
    }
    //trackEvent('Buttons', 'ToggleClick', encryptionMethod.value + ' signature');
};

// Add a new function for signature verification
const verifySignature = () => {
    try {
        if (decryptionMethod.value === 'sm2') {
            // Implement SM2 signature verification
            verificationResults.value = sm2.doVerifySignature(messageInput.value, signaturedMessageInput.value, pkPublicKey.value);
            verificationMessage.value = verificationResults.value ? "Signature is valid" : "Signature is invalid";
        } else {
            // Implement RSA signature verification
            const verify = new JSEncrypt();
            verify.setPublicKey(pkPublicKey.value);
            verificationResults.value = verify.verify(messageInput.value, signaturedMessageInput.value, CryptoJS.SHA256);
            verificationMessage.value = verificationResults.value ? "Signature is valid" : "Signature is invalid";
        }
        ElMessage.success('Verification completed');
    } catch (error) {
        ElMessage.error('Verification failed: ' + error.message);
    }
    //trackEvent('Buttons', 'ToggleClick', encryptionMethod.value + ' verifySignature');
};


const decrypt = () => {
    try {
        if (decryptionMethod.value === 'sm2') {
            // Implement SM2 decryption
            decryptedText.value = sm2.doDecrypt(encryptedInput.value, pkPrivateKey.value)
            // decryptedText.value = 'SM2 Decrypted: ' + encryptedInput.value // Placeholder
        } else {
            // Implement RSA decryption
            const decrypt = new JSEncrypt()
            decrypt.setPrivateKey(pkPrivateKey.value)
            decryptedText.value = decrypt.decrypt(encryptedInput.value)
            // decryptedText.value = 'RSA Decrypted: ' + encryptedInput.value // Placeholder
        }
        ElMessage.success('Decryption successful')
    } catch (error) {
        ElMessage.error('Decryption failed: ' + error.message)
    }
    //trackEvent('Buttons', 'ToggleClick', encryptionMethod.value + ' decrypt');
}
</script>

<style scoped>

.el-header {
    background-color: #ffffff;
    color: #1d1d1f;
    text-align: center;
    line-height: 60px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}

.el-header h1 {
    font-weight: 600;
    font-size: 24px;
    margin: 0;
}

.el-main {
    padding: 40px;
}

.el-card {
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;
    margin-bottom: 20px;
}

.el-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
    font-weight: 600;
    font-size: 18px;
    color: #1d1d1f;
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

.el-input__inner,
.el-textarea__inner {
    border-radius: 8px;
}

.el-select .el-input__inner {
    border-radius: 8px;
}

.el-tabs--border-card {
    border-radius: 12px;
    overflow: hidden;
}

.buttons-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
}
</style>