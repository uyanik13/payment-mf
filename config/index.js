import EN from '../lang/en-US.js'
import TR from '../lang/tr-TR.js'
import DE from '../lang/de-DE'
import FR from '../lang/fr-FR'
import AR from '../lang/ar-AR'
export const I18N = {
  locales: [
    {
      code: 'EN',
      iso: 'en-US',
      name: 'English',
    },
    {
      code: 'TR',
      iso: 'tr-TR',
      name: 'Turkish',
    },
    {
      code: 'FR',
      iso: 'fr-FR',
      name: 'French',
    },
    {
      code: 'DE',
      iso: 'de-DE',
      name: 'German',
    },
    {
      code: 'AR',
      iso: 'ar-AR',
      name: 'Arabic',
    },
  ],
  defaultLocale: 'EN',
  strategy: 'no_prefix',
  vueI18n: {
    fallbackLocale: 'EN',
    messages: { EN, TR, FR, DE, AR },
  },
}
