<template>
  <v-app>
    <div id="payment-app">
      <div v-if="!isNewPaymentFeatureEnabled()">
        <div v-if="appName === ''">
          <ul>
            <li>
              <button @click="cardFormClick()">Card Form</button>
            </li>
          </ul>
        </div>
        <CardForm v-if="showCardForm" />
        <PaypalForm v-if="showPaypalForm" />
      </div>
      <div v-if="isNewPaymentFeatureEnabled()" class="t--mt-5">
        <PaymentOptionList />
      </div>
    </div>
  </v-app>
</template>

<script lang="js">
import { mapGetters } from 'vuex'
import PaymentOptionList from "../components/PaymentOptionList";
import CardForm from '@/components/CardForm'
import PaypalForm from "@/components/PaypalForm";

export default {
  components: { PaymentOptionList, PaypalForm, CardForm },
  computed: {
    appName() {
      return this.$store.getters.appName
    },
    selectedPaymentOption() {
      return this.$store.getters.appParams.selectedPaymentOption
    },
    showCardForm(){
      return this.$store.getters.appName.startsWith('card-form')
    },
    showPaypalForm(){
      return this.$store.getters.appName.startsWith('paypal-form')
    },
    ...mapGetters([
      'isFeatureEnabled',
      'isFeatureFlagsLoaded',
    ])
  },
  beforeCreate() {
    this.$i18n.locale = this.$store.getters.appParams.language
    this.$vuetify.rtl = this.$store.getters.appParams.language === 'AR'
  },
  methods: {
    cardFormClick() {
      this.$store.commit('updateAppName', 'card-form')
    },
    isNewPaymentFeatureEnabled() {
      if (this.isFeatureFlagsLoaded) {
        return this.isFeatureEnabled('new_payment_options')
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>
::v-deep .v-application--wrap {
  min-height: auto;
}
.payment-options-list >>> .payment-option-radio .v-label {
  font-family: HankenSans;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.88;
  letter-spacing: normal;
  text-align: left;
  color: #000000;
}

.payment-options-list >>> .v-input__control > div.v-messages.theme--light {
  display: none;
}

.payment-list-container >>> .v-input--selection-controls {
  margin: 0;
  padding: 0;
}

.payment-option-radio >>> .v-input--selection-controls__input {
  width: 20px;
  height: 20px;
}

#payment-options >>> .v-input--selection-controls__input {
  position: relative;
}
</style>
