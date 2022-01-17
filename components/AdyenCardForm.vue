<template>
  <div class="card-form-container">
    <SkeletonLoadAdyenForm v-if="!fieldsReady" />

    <div class="t-grid t-grid-cols-12">
      <div class="t-grid t-grid-cols-12 t-col-span-12 t-gap-4">
        <v-form
          id="customCard-container"
          ref="form"
          class="t-grid t-grid-cols-12 t-gap-4 t-col-span-12 t-text-start"
        >
          <AdyenField
            field-type="encryptedCardNumber"
            :field-label="$t('cardNumber')"
            field-style-class="t-col-span-12 md:t-col-span-6"
            :invalid-error-text="$t('cardNoIsIncorrect')"
          />
          <div class="t-col-span-12 t-grid t-grid-cols-12 t-gap-4">
            <AdyenField
              field-type="encryptedExpiryDate"
              :field-label="$t('expiryDate')"
              field-style-class="t-col-span-6 md:t-col-span-3"
              :invalid-error-text="$t('fieldValueIncorrext')"
            />
            <AdyenField
              field-type="encryptedSecurityCode"
              :field-label="$t('cvv')"
              field-style-class="t-col-span-6 md:t-col-span-3"
              :invalid-error-text="$t('cvvIsIncorrect')"
            />
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import AdyenCheckout from '@adyen/adyen-web'
import '@adyen/adyen-web/dist/adyen.css'
import AdyenField from './AdyenField.vue'
import { CreatePaymentRequest } from '~/client/types'
import SkeletonLoadAdyenForm from '~/components/skeletons/SkeletonLoadAdyenForm.vue'

const environment = process.env.env
const localeMap = {
  EN: 'en_US',
  TR: 'tr_TR',
  AR: 'ar',
}
@Component({
  components: {
    AdyenField,
    SkeletonLoadAdyenForm,
  },
})
export default class AdyenCardForm extends Vue {
  @Prop({ required: true }) clientKey!: string
  @Prop({ required: true }) language!: string
  iframesLoaded = false
  iframesConfigured = false

  mounted(): void {
    this.$store.dispatch('card/resetState', true)
    const locale = Object.keys(localeMap).find((lang) => lang === this.language)
    const configuration = {
      locale: !locale ? 'en_US' : locale,
      environment: environment === 'production' ? 'live' : 'test',
      clientKey: this.clientKey,
      translations: {
        en_US: {
          'creditCard.numberField.placeholder': '',
          'creditCard.expiryDateField.placeholder': '',
          'creditCard.cvcField.placeholder.3digits': '',
          'creditCard.cvcField.placeholder.4digits': '',
        },
        tr_TR: {
          'creditCard.numberField.placeholder': '',
          'creditCard.expiryDateField.placeholder': '',
          'creditCard.cvcField.placeholder.3digits': '',
          'creditCard.cvcField.placeholder.4digits': '',
        },
        ar: {
          'creditCard.numberField.placeholder': '',
          'creditCard.expiryDateField.placeholder': '',
          'creditCard.cvcField.placeholder.3digits': '',
          'creditCard.cvcField.placeholder.4digits': '',
        },
      },
    }
    const card = new AdyenCheckout(configuration)
    card
      .create('securedfields', {
        type: 'card',
        styles: {
          base: {
            color: 'black',
            fontSize: '16px',
            background: 'white',
            fontWeight: '300',
            fontStretch: 'normal',
            fontStyle: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            fontSmoothing: 'antialiased',
            textAlign: locale === 'AR' ? 'right' : 'left',
          },
          error: {
            color: 'black',
          },
          validated: {
            color: 'black',
          },
          placeholder: {
            color: '#d8d8d8',
            fontSize: '14px',
          },
        },
        onFocus: (event: any) => {
          this.$store.dispatch(
            'card/selectedFieldName',
            event.currentFocusObject
          )
        },
        onChange: (event: any) => {
          this.$store.dispatch('card/setFieldValidity', event.valid)
        },
        onError: (event: any) => {
          const ft = event.fieldType
          const fr = event.error
          this.$store.dispatch('card/setFieldError', {
            fieldType: ft,
            fieldErr: fr,
          })
        },
        onValid: (event: any) => {
          if (event.data) {
            this.$store.dispatch('card/setCardDetailsWhenValid', event.data)
          }
        },
        onLoad: (event: any) => {
          this.iframesLoaded = event.iframesLoaded
          this.$store.dispatch(
            'card/setIframesLoadStatus',
            this.iframesLoaded && this.iframesConfigured
          )
        },
        onConfigSuccess: (event: any) => {
          this.iframesConfigured = event.iframesConfigured
          this.$store.dispatch(
            'card/setIframesLoadStatus',
            this.iframesLoaded && this.iframesConfigured
          )
        },
      })
      .mount('#customCard-container')

    const paymentCallback = () => {
      this.makeCreatePaymentRequest()
    }

    this.$store.commit('addPaymentCallback', {
      method: 'credit-card',
      provider: 'adyen',
      callback: paymentCallback,
    })
  }

  makeCreatePaymentRequest(): void {
    const isValid = this.$store.getters['card/getCardDetailsValidity']
    if (isValid) {
      const cd = this.$store.getters['card/getCardDetails']
      const cpr: CreatePaymentRequest = {
        customerId: this.$store.state.appParams.customerId + '',
        checkoutId: this.$store.state.appParams.checkoutId,
        sessionId: this.$store.state.paymentOption.sessionId,
        intentId: '',
        sessionToken: this.$store.state.paymentOption.sessionToken,
        paymentProvider: 'adyen',
        paymentMethod: 'credit-card',
        paymentMethodDetails: cd,
        returnURL: '',
        customerLocale: this.$store.state.appParams.language,
      }
      this.$store.dispatch('card/makeCreatePaymentRequest', cpr)
    } else {
      this.$store.dispatch('card/setNotInteractedFieldsError', true)
    }
  }

  get fieldsReady(): boolean {
    return this.$store.getters['card/getIframesLoadStatus']
  }
}
</script>
