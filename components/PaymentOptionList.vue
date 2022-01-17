<template>
  <div class="payment-options-list">
    <v-radio-group id="payment-options" v-model="selectedPaymentOptionIndex">
      <div
        v-for="paymentOption in $store.getters['paymentOption/paymentOptions']"
        :key="paymentOption.idx"
      >
        <PaymentOption :payment-option="paymentOption" />
      </div>
    </v-radio-group>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { mapGetters } from 'vuex'
import PaymentOption from '@/components/PaymentOption.vue'

@Component({
  components: {
    PaymentOption,
  },
  computed: {
    ...mapGetters({
      isFeatureEnabled: 'isFeatureEnabled',
      isFeatureFlagsLoaded: 'isFeatureFlagsLoaded',
    }),
  },
})
export default class PaymentOptionList extends Vue {
  created() {
    const paymentOptionParameters = {
      customerID: this.$store.state.appParams.customerId,
      checkoutID: this.$store.state.appParams.checkoutId,
      userLanguage: this.$store.state.appParams.language,
    }
    this.$store.dispatch(
      'paymentOption/getPaymentOptions',
      paymentOptionParameters
    )
    this.$store.dispatch('addCreatePaymentIntent', this.createPaymentIntent)
  }

  createPaymentIntent(): Promise<string> {
    const sessionId = this.$store.getters['paymentOption/sessionId']
    const sessionToken = this.$store.getters['paymentOption/sessionToken']
    const selectedPaymentOption =
      this.$store.getters['paymentOption/selectedPaymentOption']
    return this.$store.dispatch('createPaymentIntent', {
      sessionId,
      sessionToken,
      selectedPaymentOption,
    })
  }

  get selectedPaymentOptionIndex() {
    return this.$store.getters['paymentOption/selectedPaymentOptionIndex']
  }

  set selectedPaymentOptionIndex(value) {
    this.$store.dispatch(
      'paymentOption/selectedPaymentOptionIndexChanged',
      value
    )
  }
}
</script>
