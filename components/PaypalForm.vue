<template>
  <div id="paypal-form" class="t-text-start">
    {{ $t('paypalFormText') }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class PaypalForm extends Vue {
  mounted(): void {
    const paymentCallback = (payload: any) => {
      this.makePayment(payload)
    }

    this.$store.commit('addPaymentCallback', {
      method: 'paypal',
      provider: 'braintree',
      callback: paymentCallback,
    })
  }

  makePayment(payload: any) {
    const sessionId = this.$store.getters['paymentOption/sessionId']
    const sessionToken = this.$store.getters['paymentOption/sessionToken']
    const selectedPaymentOption =
      this.$store.getters['paymentOption/selectedPaymentOption']

    this.$store.dispatch('createBraintreePaypalPayment', {
      sessionId,
      sessionToken,
      selectedPaymentOption,
      nonce: payload.nonce,
      intentId: payload.intentId,
    })
  }
}
</script>

<style scoped></style>
