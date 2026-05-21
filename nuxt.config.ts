/**
 * @datetime 2026-05-21 00:00:00
 * @model GLM-5.1
 */
export default defineNuxtConfig({
  srcDir: 'src/',

  modules: ['@nuxt/ui', '@nuxt/eslint'],

  // ssr: false causes vite-node IPC socket error in dev mode
  // Only disable SSR when generating static site (set NUXT_SSR=false)
  ssr: process.env.NUXT_SSR !== 'false',

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Ham Admin Console',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Ham Admin Web - Manage app versions and open applications',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  devtools: { enabled: false },

  compatibilityDate: '2026-05-21',
})
