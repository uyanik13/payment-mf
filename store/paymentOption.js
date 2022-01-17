import Vue from 'vue'
import Vuex from 'vuex'
import paymentOptionClient from '@/client/payment-option'
Vue.use(Vuex)

export const state = () => ({
  selectedPaymentOption: {},
  paymentOptions: [],
  providerTokens: [],
  getPaymentOptionsError: '',
  sessionId: '',
  sessionToken: '',
})

export const mutations = {
  getPaymentOptionsSuccess(state, paymentOptions) {
    state.paymentOptions = paymentOptions.paymentOptions
    state.providerTokens = paymentOptions.providerTokens
    state.sessionId = paymentOptions.sessionId
    state.sessionToken = paymentOptions.sessionToken
    if (
      paymentOptions.defaultSelectedIdx != null &&
      paymentOptions.defaultSelectedIdx in paymentOptions.paymentOptions
    ) {
      state.selectedPaymentOption =
        paymentOptions.paymentOptions[paymentOptions.defaultSelectedIdx]
    }
    const providerToken = paymentOptions.providerTokens.find(
      (providerToken) =>
        state.selectedPaymentOption.provider === providerToken.provider
    )
    state.selectedPaymentOption.token =
      providerToken == null ? '' : providerToken.token
    if (Vue.prototype.$sdk) {
      Vue.prototype.$sdk.dispatchGlobal({
        name: 'payment/selectedPaymentOptionChanged',
        data: state.selectedPaymentOption,
      })
    }
  },
  getPaymentOptionsFailed(state, error) {
    state.getPaymentOptionsError = error
  },
  updateSelectedPaymentOption(state, selectedPaymentOptionIndex) {
    const selectedPaymentOption = state.paymentOptions.find(
      (paymentOption) => selectedPaymentOptionIndex === paymentOption.idx
    )
    state.selectedPaymentOption = selectedPaymentOption
    const providerToken = state.providerTokens.find(
      (providerToken) =>
        state.selectedPaymentOption.provider === providerToken.provider
    )
    state.selectedPaymentOption.token =
      providerToken == null ? '' : providerToken.token

    if (providerToken !== undefined) {
      state.selectedPaymentOption.params = providerToken.params
    }

    if (Vue.prototype.$sdk) {
      Vue.prototype.$sdk.dispatchGlobal({
        name: 'payment/selectedPaymentOptionChanged',
        data: state.selectedPaymentOption,
      })
    }
  },
}

export const actions = {
  async getPaymentOptions({ commit, rootState }, paymentOptionParameters) {
    try {
      const paymentOptions = await paymentOptionClient.getPaymentOptions(
        paymentOptionParameters.customerID,
        paymentOptionParameters.checkoutID,
        paymentOptionParameters.userLanguage
      )
      commit('getPaymentOptionsSuccess', paymentOptions)
    } catch (Error) {
      commit('getPaymentOptionsFailed', Error)
    }
  },
  selectedPaymentOptionIndexChanged(
    { commit, rootState },
    selectedPaymentOptionIndex
  ) {
    // const globalState = rootState.sdk.globalState.getGlobalState()
    // rootState.sdk.globalState.setGlobalState({
    //   ...globalState,
    //   selectedPaymentOption
    // })

    commit('updateSelectedPaymentOption', selectedPaymentOptionIndex)
  },
}

export const getters = {
  paymentOptions(state) {
    return state.paymentOptions
  },
  getPaymentOptionsError(state) {
    return state.getPaymentOptionsError
  },
  selectedPaymentOption(state) {
    return state.selectedPaymentOption
  },
  selectedPaymentOptionIndex(state) {
    return state.selectedPaymentOption.idx
  },
  sessionId(state) {
    return state.sessionId
  },
  sessionToken(state) {
    return state.sessionToken
  },
}
