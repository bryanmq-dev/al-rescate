import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/icon', 'nuxt-auth-utils'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  fonts: {
    families: [
      { name: 'Fredoka', provider: 'google', weights: [500, 600, 700] },
      { name: 'Figtree', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Kalam', provider: 'google', weights: [400, 700] },
    ],
  },
  icon: { mode: 'svg', serverBundle: { collections: ['ph'] } },
  runtimeConfig: {
    // ponytail: one shared admin password, add per-user accounts when there are several volunteers
    adminPassword: 'alrescate',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Al ResCate',
      meta: [
        { name: 'description', content: 'Rescatamos perros y gatos en Bolivia. Sigue cada historia, desde la calle hasta un hogar, y ayuda a escribir la siguiente.' },
        { name: 'theme-color', content: '#0d2a20' },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
})
