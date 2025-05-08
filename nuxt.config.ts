// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@formkit/auto-animate',
    '@nuxtjs/tailwindcss',
    '@nuxt/ui'
  ],
  css: ['~/assets/css/main.css'],
  ui: {
    global: true,
    icons: ['heroicons', 'simple-icons']
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
  }
})