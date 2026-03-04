<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Page container -->
        <div class="mx-auto max-w-7xl px-6 py-12">
            <!-- Header -->
            <div class="mb-12 text-center">
                <h1 class="text-3xl font-semibold tracking-tight text-gray-900">
                    {{ t('home.title') }}
                </h1>
                <p class="mt-3 text-gray-500">
                    {{ t('home.subtitle') }}
                </p>
            </div>

            <!-- Tool grid -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div v-for="(tool, index) in tools" :key="tool.path" @click="$router.push(tool.path)"
                    class="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
                    :style="{ animationDelay: `${index * 80}ms` }">
                    <el-card class="h-full rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur
                   shadow-sm transition-all duration-300
                   group-hover:shadow-lg group-hover:border-gray-300" body-class="p-6">
                        <!-- Icon -->
                        <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center
                     rounded-2xl bg-blue-50 text-blue-600
                     transition-all duration-300
                     group-hover:bg-blue-100">
                            <component :is="tool.icon" class="h-8 w-8" />
                        </div>

                        <!-- Title -->
                        <h3 class="mb-2 text-center text-base font-semibold text-gray-900
                     truncate">
                            {{ tool.title }}
                        </h3>

                        <!-- Description -->
                        <p class="text-center text-sm leading-relaxed text-gray-500">
                            {{ tool.description }}
                        </p>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    Lock,
    Document,
    Key,
    Connection,
    Picture,
    Refresh,
    Cpu,
    InfoFilled
} from '@element-plus/icons-vue'

const { t } = useI18n()

const tools = computed(() => [
    {
        title: t('home.tools.randomPwd.title'),
        description: t('home.tools.randomPwd.description'),
        path: '/randompwd',
        icon: Key
    },
    {
        title: t('home.tools.fileEncrypt.title'),
        description: t('home.tools.fileEncrypt.description'),
        path: '/file_encrypt',
        icon: Document
    },
    {
        title: t('home.tools.syEn.title'),
        description: t('home.tools.syEn.description'),
        path: '/syen',
        icon: Lock
    },
    {
        title: t('home.tools.asEn.title'),
        description: t('home.tools.asEn.description'),
        path: '/asen',
        icon: Connection
    },
    {
        title: t('home.tools.image2pdf.title'),
        description: t('home.tools.image2pdf.description'),
        path: '/image2pdf',
        icon: Picture
    },
    {
        title: t('home.tools.encoding.title'),
        description: t('home.tools.encoding.description'),
        path: '/ende',
        icon: Refresh
    },
    {
        title: t('home.tools.hash.title'),
        description: t('home.tools.hash.description'),
        path: '/hash',
        icon: Cpu
    },
    {
        title: t('home.tools.about.title'),
        description: t('home.tools.about.description'),
        path: '/about',
        icon: InfoFilled
    }
])
</script>
