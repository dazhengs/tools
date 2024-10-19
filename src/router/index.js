import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/randompwd',
    },
    {
      path: '/syen',
      name: 'SymmetricEncryption',
      component: () => import('../views/encrypt_decrypt.vue'),
      meta: { title: 'SymmetricEncryption' }  // 定义 title
    },
    {
      path: '/asen',
      name: 'AsymmetricEncryption',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/rsasm2.vue'),
      meta: { title: 'AsymmetricEncryption' }  // 定义 title
    },
    {
      path: '/ende',
      name: 'EncodingDecoding',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/encode_decode.vue'),
      meta: { title: 'EncodingDecoding' }  // 定义 title
    },

    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/about.vue'),
      meta: { title: 'About' }  // 定义 title
    },

    {
      path: '/hash',
      name: 'hash',
      // route level code-splitting
      // this generates a separate chunk (hash.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/hash.vue'),
      meta: { title: 'Hash' }  // 定义 title
    },

    {
      path: '/randompwd',
      name: 'randompwd',
      // route level code-splitting
      // this generates a separate chunk (randompwd.[randompwd].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/randompwd.vue'),
      meta: { title: 'Random Password' }  // 定义 title
    },

    {
      path: '/file_encrypt',
      name: 'file_encrypt',
      // route level code-splitting
      // this generates a separate chunk (randompwd.[randompwd].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/file_encrypt.vue'),
      meta: { title: 'File Encrypt & Decrypt' }  // 定义 title
    }




  ]
})

export default router
