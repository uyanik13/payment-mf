/* eslint-disable no-redeclare */ /* eslint-disable no-undef */
<template>
  <div>
    <div :id="`${method}`"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// eslint-disable-next-line no-redeclare
// eslint-disable-next-line no-var
declare var Klarna: any
@Component
export default class KlarnaForm extends Vue {
  @Prop({ required: true }) method!: string
  @Prop({ required: true }) clientToken!: string

  mounted(): void {
    const paymentCallback = (payload: any) => {
      this.makePayment(payload)
    }

    this.$store.commit('addPaymentCallback', {
      method: this.method,
      provider: 'klarna',
      callback: paymentCallback,
    })
  }

  created(): void {
    const globalAny: any = global
    globalAny.window.klarnaAsyncCallback = () => {
      // eslint-disable-next-line no-undef
      if (Klarna !== undefined) {
        this.initKlarna()
      }
    }
  }

  initKlarna(): void {
    // eslint-disable-next-line no-undef
    Klarna.Payments.init({
      client_token: this.clientToken,
    })
    // eslint-disable-next-line no-undef
    Klarna.Payments.load({
      container: `#${this.method}`,
      payment_method_category: `${this.method}`,
    })
  }

  head(): any {
    return {
      script: [
        {
          hid: 'klarna',
          src: 'https://x.klarnacdn.net/kp/lib/v1/api.js',
          defer: true,
        },
      ],
    }
  }

  makePayment(payload: any) {
    const sessionId = this.$store.getters['paymentOption/sessionId']
    const sessionToken = this.$store.getters['paymentOption/sessionToken']
    const selectedPaymentOption =
      this.$store.getters['paymentOption/selectedPaymentOption']

    // eslint-disable-next-line no-undef
    Klarna.Payments.authorize(
      {
        payment_method_category: this.method,
      },
      selectedPaymentOption.params,
      (response: any) => {
        if (response.approved && response.authorization_token) {
          this.$store.dispatch('createKlarnaPayment', {
            sessionId,
            sessionToken,
            selectedPaymentOption,
            authorizationToken: response.authorization_token,
            intentId: payload.intentId,
          })
        }
      }
    )
  }
}
</script>
