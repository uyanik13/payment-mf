import { I18N } from './config'

loadEnvironmentVariables()
export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  ssr: false,
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Modanisa',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || 'payment-mf',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: ['@/assets/css/main.css'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~/plugins/jesse-card.js', mode: 'client' },
    '@/plugins/axios-locale.js',
    '@/plugins/auth.js',
    { src: '@/plugins/unleash.js', ssr: false },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],
  vuetify: { optionsPath: './vuetify.config.js' },
  tailwindcss: {
    jit: true,
  },
  /*
   ** Nuxt.js modules
   */
  modules: ['@femessage/nuxt-micro-frontend', ['nuxt-i18n', I18N]],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    publicPath: process.env.PUBLIC_PATH,
  },
  render: {
    dist: {
      setHeaders(res) {
        res.setHeader('X-Frame-Options', 'ALLOWALL')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', '*')
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept'
        )
      },
    },
  },
  MFE: {
    force: true,
  },
  // Define env variables here
  env: {
    apiBaseURL: process.env.API_BASE_URL,
    legacyApiBaseURL: process.env.LEGACY_API_BASE_URL,
    api2BaseURL: process.env.API_V2_BASE_URL,
    env: process.env.ENV,
  },
  extend(config, ctx) {
    if (!ctx.isDev) {
      config.output.publicPath = 'http://localhost:3101/_nuxt/'
    }
  },
}

function loadEnvironmentVariables() {
  const staging = process.env.NODE_ENV === 'staging'
  const production = process.env.NODE_ENV === 'production'
  const phoenix = process.env.NODE_ENV === 'phoenix'
  const qa = process.env.NODE_ENV === 'qa'

  if (staging) {
    require('dotenv').config({ path: './.environment/staging' })
  } else if (production) {
    require('dotenv').config({ path: './.environment/production' })
  } else if (qa) {
    require('dotenv').config({ path: './.environment/qa' })
  } else if (phoenix) {
    require('dotenv').config({ path: './.environment/phoenix' })
  } else {
    require('dotenv').config({ path: './.environment/local' })
  }
}
