import Vue from 'vue'
import { cardPay } from '@/client/card'
import paymentClient from '@/client/payment'
import { getInstallmentOptions } from '~/client/installment-options'
import { InternalServerError, ServiceUnavailableError } from '~/types/error'
import auth from '~/plugins/auth'

export const state = () => ({
  cardNumber: String | null,
  cardBinNumber: String | null,
  binInstallmentOptions: [],
  appParams: {
    shippingCountryCode: '',
    language: 'EN',
    customerId: '',
    checkoutId: '',
    selectedPaymentOption: {},
  },
  paymentDetails: {
    price: 0,
    currency: '',
    categories: [],
  },
  auth: {
    token: null,
  },
  appName: '',
  selectedInstallment: 1,
  customerId: '',
  customerEmail: 'test@email.com',
})

export const mutations = {
  updateAppParams(state, appParams) {
    state.appParams = appParams
    state.customerId = appParams.customerId
  },
  updatePaymentDetails(state, paymentDetails) {
    state.paymentDetails = paymentDetails
  },
  updateAuthToken(state, token) {
    state.auth = { ...auth, token }
    if (Vue.prototype.$mfReady) {
      Vue.prototype.$mfReady()
    }
  },
  updateAppName(state, appName) {
    state.appName = appName
  },
  setCardNumber(state, cardNumber) {
    state.cardNumber = cardNumber
  },

  setCardBinNumber(state, cardBinNumber) {
    state.cardBinNumber = cardBinNumber
  },
  setBinInstallmentOptions(state, binInstallmentOptions) {
    state.binInstallmentOptions = binInstallmentOptions
  },
  addPaymentCallback(state, payload) {
    if (Vue.prototype.$sdk) {
      Vue.prototype.$sdk.dispatchGlobal({
        name: 'addPaymentCallback',
        data: payload,
      })
    }
  },
  setSelectedInstallment(state, selectedInstallment) {
    state.selectedInstallment = selectedInstallment
  },
  updateCheckoutTotalPrice(state, totalPrice) {
    if (Vue.prototype.$sdk) {
      Vue.prototype.$sdk.dispatchGlobal({
        name: 'checkout/updateTotalPrice',
        data: totalPrice,
      })
    }
  },
}

export const actions = {
  async setCardNumber({ commit }, cardNumber) {
    commit('setCardNumber', cardNumber)
    const binNumber = cardNumber.replace(/\s+/g, '').substring(0, 6)
    if (this.state.cardBinNumber !== binNumber) {
      commit('setCardBinNumber', binNumber)
      if (binNumber.length >= 6) {
        const binInstallmentOptions = await getInstallmentOptions(binNumber, {
          price: this.state.paymentDetails.price,
          categories: this.state.paymentDetails.categories,
        })
        commit('setBinInstallmentOptions', binInstallmentOptions)
      } else {
        commit('setBinInstallmentOptions', [])
      }
    }
  },
  async makeCardPayment({ commit }, cardPayRequest) {
    try {
      const paymentResponse = await cardPay('', '', cardPayRequest)
      if (paymentResponse.redirectUrl.length !== 0) {
        Vue.prototype.$sdk.dispatchGlobal({
          name: 'checkout/openThreedDialog',
          data: true,
        })
      } else {
        Vue.prototype.$sdk.dispatchGlobal({
          name: 'checkout/paymentSucceed',
        })
      }
    } catch (e) {
      if (e instanceof InternalServerError) {
        e.message = this.app.i18n.t('internalServerError')
      }

      if (e instanceof ServiceUnavailableError) {
        e.message = this.app.i18n.t('internalServerError')
      }

      Vue.prototype.$sdk.dispatchGlobal({
        name: 'checkout/paymentFailed',
        data: e.message,
      })
    }
  },
  selectedInstallmentChanged({ commit }, selectedInstallment) {
    commit('setSelectedInstallment', selectedInstallment)
    const installmentOption =
      this.state.binInstallmentOptions.installments.find(
        (e) => e.installmentNumber === selectedInstallment
      )
    commit('updateCheckoutTotalPrice', installmentOption.total)
  },
  cardFormValidation({ commit }, validation) {
    Vue.prototype.$sdk.dispatchGlobal({
      name: 'spinnerDisabled',
      data: { isValid: validation.isValid },
    })
  },
  updatePaymentDetails({ commit }, paymentDetails) {
    const categories = []
    paymentDetails.orders.forEach((order) => {
      order.products.forEach((product) => {
        if (!product.categoryIds) return
        product.categoryIds.forEach((categoryId) => {
          if (!categories.includes(categoryId)) {
            categories.push(categoryId)
          }
        })
      })
    })

    commit('updatePaymentDetails', {
      price: paymentDetails.price,
      currency: paymentDetails.currency,
      categories,
    })
  },
  async createKlarnaPayment({ commit, state }, payload) {
    try {
      const createPaymentRequest = {
        checkoutId: state.appParams.checkoutId,
        customerId: state.appParams.customerId + '',
        sessionId: payload.sessionId,
        sessionToken: payload.sessionToken,
        intentId: payload.intentId,
        paymentMethodDetails: {
          token: payload.authorizationToken,
        },
        paymentMethod: payload.selectedPaymentOption.method,
        paymentProvider: payload.selectedPaymentOption.provider,
        customerLocale: state.appParams.language,
      }
      await paymentClient.createPayment(createPaymentRequest)
      Vue.prototype.$sdk.dispatchGlobal({
        name: 'checkout/paymentSucceed',
        data: {
          paymentMethodLabel: payload.selectedPaymentOption.label,
        },
      })
    } catch (e) {
      if (e instanceof InternalServerError) {
        e.message = this.app.i18n.t('internalServerError')
      }

      if (e instanceof ServiceUnavailableError) {
        e.message = this.app.i18n.t('internalServerError')
      }

      Vue.prototype.$sdk.dispatchGlobal({
        name: 'checkout/paymentFailed',
        data: e.message,
      })
    }
  },
  async createBraintreePaypalPayment({ commit, state }, payload) {
    try {
      const createPaymentRequest = {
        checkoutId: state.appParams.checkoutId,
        customerId: state.appParams.customerId + '',
        sessionId: payload.sessionId,
        sessionToken: payload.sessionToken,
        intentId: payload.intentId,
        paymentMethodDetails: {
          token: payload.nonce,
        },
        paymentMethod: payload.selectedPaymentOption.method,
        paymentProvider: payload.selectedPaymentOption.provider,
        customerLocale: state.appParams.language,
      }
      await paymentClient.createPayment(createPaymentRequest)
      Vue.prototype.$sdk.dispatchGlobal({
        name: 'checkout/paymentSucceed',
        data: {
          paymentMethodLabel: payload.selectedPaymentOption.label,
        },
      })
    } catch (e) {
      if (e instanceof InternalServerError) {
        e.message = this.app.i18n.t('internalServerError')
      }

      if (e instanceof ServiceUnavailableError) {
        e.message = this.app.i18n.t('internalServerError')
      }

      Vue.prototype.$sdk.dispatchGlobal({
        name: 'checkout/paymentFailed',
        data: e.message,
      })
    }
  },
  addCreatePaymentIntent({ commit }, payload) {
    Vue.prototype.$sdk.dispatchGlobal({
      name: 'payment/addCreatePaymentIntent',
      data: payload,
    })
  },
  createPaymentIntent({ commit, state }, payload) {
    const request = {
      checkoutId: state.appParams.checkoutId,
      sessionId: payload.sessionId,
      sessionToken: payload.sessionToken,
      customerId: state.appParams.customerId + '',
      paymentMethod: payload.selectedPaymentOption.method,
      paymentProvider: payload.selectedPaymentOption.provider,
      customerLocale: state.appParams.language,
    }
    return paymentClient.createPaymentIntent(request)
  },
}

export const getters = {
  cardNumber(state) {
    return state.cardNumber
  },
  binInstallmentOptions(state) {
    return state.binInstallmentOptions
  },
  cardBinNumber(state) {
    return state.cardBinNumber
  },
  appParams(state) {
    return state.appParams
  },
  appName(state) {
    return state.appName
  },
  paymentDetails(state) {
    return state.paymentDetails
  },
  isFeatureEnabled: (state) => (featureName) => {
    return state.unleash.enabledFeatures[featureName] === true
  },
  isFeatureFlagsLoaded: (state) => {
    return !state.unleash.loading
  },
  appLanguage: (state) => {
    return state.appParams.language
  },
}
