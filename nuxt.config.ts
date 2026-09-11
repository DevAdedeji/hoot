import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    '@server': fileURLToPath(new URL('./server', import.meta.url))
  },

  modules: ['@nuxt/ui'],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },

  css: ['~/assets/tailwind.css'],

  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },

  ui: {
    fonts: false
  },

  compatibilityDate: '2026-06-30',

  icon: {
    clientBundle: {
      scan: true
    }
  },

  nitro: {
    serverAssets: [{ baseName: 'email', dir: './server/assets' }]
  }
})
