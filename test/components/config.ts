import VueI18n from 'vue-i18n'
import en from '@/lang/en-US'

export function initI18N(vue: any): VueI18n {
  vue.use(VueI18n)
  return new VueI18n({
    locale: 'en',
    messages: {
      en,
    },
    silentTranslationWarn: true,
  })
}
