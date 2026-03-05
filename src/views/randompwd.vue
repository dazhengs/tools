<template>
    <div class="container">
        <div class="title">{{ $t('random_password.title') }}</div>
        <el-card class="settings-card">
            <template #header>
                <div class="card-header">
                    <span>{{ $t('random_password.passwordLengthSettings') }}</span>
                </div>
            </template>
            <div class="settings">
                <el-slider v-model="passwordLength"  :mix="4" :max="128" show-input />
            </div>
        </el-card>

        <div class="buttons-wrapper">
            <el-button class="encode-btn" size="large" @click="generatePassword">{{ $t('random_password.generate') }}</el-button>
        </div>


        <div class="content">
            <el-card class="output-card">
                <template #header>
                    <div class="card-header">
                        <span>{{ $t('random_password.generatedPassword') }}</span>
                    </div>
                </template>
                <CopyTextarea v-model="generatedPassword" :rows="4" readonly
                    :placeholder="$t('random_password.generatedPasswordPlaceholder')" />
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
// import { trackEvent } from '@/utils/use-analytics';
import CopyTextarea from '@/views/component/copy_textarea.vue';
const generatedPassword = ref('');
const passwordLength = ref(8);

function generatePassword() {

    if (passwordLength.value < 4 || passwordLength.value > 128) {
        return
    }

    //trackEvent('Buttons', 'ToggleClick', 'generatePassword');
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

    let password = "";
    // Ensure password contains at least one number, one special character, and one uppercase letter
    password += charset.charAt(Math.floor(Math.random() * 26)); // Lowercase letter
    password += charset.charAt(Math.floor(Math.random() * 26) + 26); // Uppercase letter
    password += charset.charAt(Math.floor(Math.random() * 10) + 52); // Number
    password += charset.charAt(Math.floor(Math.random() * 12) + 62); // Special character

    for (let i = 0; i < passwordLength.value - 4; ++i) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    // Shuffle the password to ensure the required characters are not always at the start
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    generatedPassword.value = password;
}
</script>

<style scoped>
/* Container for the entire layout */

/* Select dropdown wrapper */
.settings-card,
.output-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    background-color: #F7F8FA;
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
    margin-top: 20px;
    width: 120px;
    background-color: #007aff;
    color: #fff;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.encode-btn:hover {
    background-color: #005bb5;
}

/* Success decode button */

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
