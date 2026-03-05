<template>
    <div class="container">
      <h2 class="title">{{ $t('hash.title') }}</h2>
      
      <div class="select-wrapper">
        <el-radio-group v-model="selectedHash" size="large">
          <el-radio class="radio-button" value="md5">MD5</el-radio>
          <el-radio class="radio-button" value="sha1">SHA1</el-radio>
          <el-radio class="radio-button" value="sha256">SHA256</el-radio>
          <el-radio class="radio-button" value="sha3">SHA3</el-radio>
          <el-radio class="radio-button" value="sha512">SHA512</el-radio>
          <el-radio class="radio-button" value="sm3">SM3</el-radio>
        </el-radio-group>
      </div>
      
      <div class="input-area">
        <el-input
          type="textarea"
          :rows="4"
          :placeholder="$t('hash.placeholder.input')"
          v-model="inputText"
          class="input-box"
        ></el-input>
      </div>
      
      <div class="buttons-wrapper">
        <el-button class="encode-btn" size="large" @click="calculateHash">{{ $t('hash.button.calculate') }}</el-button>
      </div>
      
      <div class="output-area">
        <CopyTextarea
          :rows="4"
          :placeholder="$t('hash.placeholder.output')"
          v-model="hashValue"
          readonly
          resize="none"
          class="output-box"
        ></CopyTextarea>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  // import { trackEvent } from '@/utils/use-analytics';
  import { useCrypto } from '@/utils/crypto.js';
  import CopyTextarea from '@/views/component/copy_textarea.vue';
  const selectedHash = ref('md5');
  const inputText = ref('');
  const hashValue = ref('');
  
  const calculateHash = async () => {
    if (!selectedHash.value || !inputText.value) {
      console.error('Please select a hash algorithm and input text.');
      return;
    }
    //trackEvent('Buttons', 'ToggleClick', 'calculateHash');
    try {
      const crypto = useCrypto();
      const hash = await crypto[selectedHash.value](inputText.value);
      hashValue.value = hash;
    } catch (error) {
      console.error('Error calculating hash:', error);
    }
  };
  </script>
  
  <style scoped> 
  
  .select-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }
  
  .radio-button {
    margin-right: 15px;
  }
  
  .input-area,
  .output-area {
    margin-bottom: 25px;
    border: 1px solid #e1e1e1;
    border-radius: 8px;
  }
  
  .output-area {
    margin-top: 25px;
  }




  .input-box,
  .output-box {
    border-radius: 12px;
    padding: 12px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;
  }
  
  .input-box:focus,
  .output-box:focus {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-color: #007aff;
  }
  
  .buttons-wrapper {
    display: flex;
    justify-content: center;
  }
  
  .encode-btn {
    background-color: #007aff;
    color: #fff;
    font-weight: 600;
    font-size: 18px;
    padding: 14px 40px;
    border-radius: 12px;
    transition: background-color 0.3s ease;
  }
  
  .encode-btn:hover {
    background-color: #005bb5;
  }
  
  @media (max-width: 600px) {
    .container {
      padding: 15px;
    }
    
    
  
    .encode-btn {
      padding: 12px 30px;
      font-size: 16px;
    }
  }

  </style>
  