// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
