<template>
  <el-config-provider :locale="elLocale">
    <el-container class="layout-container">
      <el-header>
        <!-- <nav>
        <RouterLink to="/">SymmetricEncryption</RouterLink>
        <RouterLink to="/asen">AsymmetricEncryption</RouterLink>
        <RouterLink to="/ende">EncodingDecoding</RouterLink>
      </nav> -->
        <el-menu :default-active="activeIndex" :default-openeds="['1']" router mode="horizontal" :ellipsis="false"
          @select="handleSelect">
          <el-menu-item index="/">
            <el-icon>
              <HomeFilled />
            </el-icon>
          </el-menu-item>

          <el-sub-menu index="0">
            <template #title><svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="1.2em" height="1.2em"
                data-v-f414ea64="">
                <path fill="currentColor"
                  d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301a14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725a16.676 16.676 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877a16.165 16.165 0 0 0 2.91-4.876L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z">
                </path>
              </svg></template>
            <el-menu-item @click="changeLanguage('zh')"><i class="fi fi-cn"></i> &nbsp; 中文</el-menu-item>
            <el-menu-item @click="changeLanguage('en')"><i class="fi fi-us"></i> &nbsp; English</el-menu-item>
          </el-sub-menu>

          <el-sub-menu v-if="isMobile" index="1">
            <template #title>{{ $t('nav.encryption') }}</template>
            <el-menu-item index="/randompwd">{{ $t('nav.random_password') }}</el-menu-item>
            <el-menu-item index="/file_encrypt">{{ $t('nav.file_encrypt') }}</el-menu-item>
            <el-menu-item index="/syen">{{ $t('nav.symmetric_encryption') }}</el-menu-item>
            <el-menu-item index="/asen">{{ $t('nav.asymmetric_encryption') }}</el-menu-item>
            <el-menu-item index="/image2pdf">{{ $t('imageToPdf.nav') }}</el-menu-item>
          </el-sub-menu>


          <el-menu-item v-if="!isMobile" index="/image2pdf">{{ $t('imageToPdf.nav') }}</el-menu-item>
          <el-menu-item v-if="!isMobile" index="/randompwd">{{ $t('nav.random_password') }}</el-menu-item>
          <el-menu-item v-if="!isMobile" index="/file_encrypt">{{ $t('nav.file_encrypt') }}</el-menu-item>
          <el-menu-item v-if="!isMobile" index="/syen">{{ $t('nav.symmetric_encryption') }}</el-menu-item>
          <el-menu-item v-if="!isMobile" index="/asen">{{ $t('nav.asymmetric_encryption') }}</el-menu-item>


          <el-menu-item index="/ende">{{ $t('nav.encoding') }}</el-menu-item>
          <el-menu-item index="/hash">{{ $t('nav.hash') }}</el-menu-item>

        </el-menu>

      </el-header>
      <el-main>
        <RouterView />
      </el-main>
      <!-- <el-footer height="30px">@copyright</el-footer> -->

      <!-- <el-table mb-1 :data="[]" />
      <el-pagination :total="100" /> -->


    </el-container>
  </el-config-provider>
</template>
<script setup>
import { RouterView } from 'vue-router'
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router';
import enLocale from 'element-plus/es/locale/lang/en';
import zhLocale from 'element-plus/es/locale/lang/zh-cn';
import { useI18n } from 'vue-i18n';
import { useMainStore } from '@/store';
const { locale } = useI18n();
const elLocale = ref(zhLocale)
const activeIndex = ref('/')
const handleSelect = (key, keyPath) => {

}

const store = useMainStore();
const isMobile = computed(() => store.isMobile);

const openGitHub = () => {
  window.open('https://github.com/dazhengs/tools', '_blank', 'noopener,noreferrer');
};

const route = useRoute();
// Watch for changes in the route
watch(route, (newRoute) => {
  activeIndex.value = newRoute.path; // Update activeIndex based on the current path
});

const changeLanguage = (lang) => {
  locale.value = lang;
  elLocale.value = lang === 'zh' ? zhLocale : enLocale
  // Store the selected language in localStorage
  localStorage.setItem('locale', lang);

};

</script>


<style scoped>
.layout-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.el-menu--horizontal>.el-menu-item:nth-child(1) {
  margin-right: auto;
}

.el-main {
  padding: 0;
}
</style>