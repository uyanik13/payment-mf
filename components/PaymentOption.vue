<template>
  <div class="t-pb-4">
    <div
      :class="{
        't-border-orange-500': isSelectedPaymentOption(paymentOption),
      }"
      class="t-border-2 t-rounded-5px t-p-18px md:t-pr-6 md:t-pl-6 md:t-py-6"
    >
      <div class="payment-option-radio t-flex t-h-5">
        <v-radio
          :id="paymentOption.idx + ''"
          color="#ff6000"
          :label="paymentLabel(paymentOption)"
          :ripple="false"
          :value="paymentOption.idx"
          class="payment-options-change-selector"
        ></v-radio>
        <img
          :src="paymentOption.iconURL"
          class="payment-option-icon t-ms-auto"
        />
      </div>

      <div
        v-if="
          isSelectedPaymentOption(paymentOption) &&
          isIyzicoCreditCardOption(paymentOption)
        "
      >
        <hr class="t-mt-4 t-mb-6 t-border-gray-300 md:t-mb-6" />
        <CardForm />
      </div>

      <div
        v-if="
          isSelectedPaymentOption(paymentOption) &&
          isAdyenCreditCardOption(paymentOption)
        "
      >
        <hr class="t-mt-4 t-mb-6 t-border-gray-300 md:t-mb-6" />
        <AdyenCardForm
          :client-key="selectedPaymentOption.token.clientKey"
          :language="language"
        />
      </div>

      <div
        v-if="
          isSelectedPaymentOption(paymentOption) &&
          isKlarnaOption(paymentOption)
        "
      >
        <hr class="t-mt-4 t-mb-4 t-border-gray-300 md:t-mb-6" />
        <KlarnaForm
          :client-token="selectedPaymentOption.token"
          :method="paymentOption.method"
        />
      </div>

      <div
        v-if="
          isSelectedPaymentOption(paymentOption) &&
          isPaypalBraintreeOption(paymentOption)
        "
      >
        <hr class="t-mt-4 t-mb-4 t-border-gray-300 md:t-mb-6" />
        <PaypalForm />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import CardForm from '@/components/CardForm.vue'
import { PaymentOption as PaymentOptionModel } from '~/client/types'
import PaypalForm from '~/components/PaypalForm.vue'
import AdyenCardForm from '~/components/AdyenCardForm.vue'
import KlarnaForm from '~/components/KlarnaForm.vue'

@Component({
  components: {
    PaypalForm,
    AdyenCardForm,
    CardForm,
    KlarnaForm,
  },
  computed: {
    ...mapGetters({
      isFeatureEnabled: 'isFeatureEnabled',
      isFeatureFlagsLoaded: 'isFeatureFlagsLoaded',
    }),
  },
})
export default class PaymentOption extends Vue {
  @Prop({ required: true }) paymentOption!: PaymentOptionModel

  get selectedPaymentOption(): any {
    if (this.$store) {
      return this.$store.getters['paymentOption/selectedPaymentOption']
    }
  }

  isSelectedPaymentOption(paymentOption: any): boolean {
    return (
      this.selectedPaymentOption.provider === paymentOption.provider &&
      this.selectedPaymentOption.method === paymentOption.method
    )
  }

  isIyzicoCreditCardOption(paymentOption: any): boolean {
    return (
      paymentOption.provider === 'iyzico' &&
      paymentOption.method === 'credit-card'
    )
  }

  isAdyenCreditCardOption(paymentOption: any): boolean {
    return (
      paymentOption.provider === 'adyen' &&
      paymentOption.method === 'credit-card'
    )
  }

  isPaypalBraintreeOption(paymentOption: any): boolean {
    return (
      paymentOption.provider === 'braintree' &&
      paymentOption.method === 'paypal'
    )
  }

  isKlarnaOption(paymentOption: any): boolean {
    return paymentOption.provider === 'klarna'
  }

  get language(): string {
    return this.$store.getters.appLanguage
  }

  paymentLabel(paymentOption: any): string {
    if (
      paymentOption.method === 'credit-card' &&
      paymentOption.provider === 'adyen'
    )
      return this.$t('creditAndDebitCard').toString()
    return paymentOption.label
  }
}
</script>

<style scoped>
.payment-options-change-selector >>> .v-input--selection-controls__ripple {
  left: -13px;
  margin-top: 10px;
}
.payment-options-change-selector >>> .v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
}
.payment-options-change-selector >>> .v-icon.v-icon {
  font-size: 20px !important;
  color: #d2d2d2;
}
.payment-options-change-selector >>> .v-label {
  align-self: start;
}
.payment-options-change-selector >>> .v-input--selection-controls__input {
  padding-top: 5px;
  margin-left: -4px;
}

.payment-option-icon {
  max-width: 100%;
  max-height: 20px;
  display: block;
}
.payment-option-box {
  height: 72px;
}
</style>
