import Vue from 'vue'
import Vuex from 'vuex'
import paymentClient from '@/client/payment'
import { PaymentError } from '~/types/error'
Vue.use(Vuex)

export const state = () => ({
  cardNumber: '',
  cardNumberError: '',
  cardNumberValid: true,
  cardDate: '',
  cardDateError: '',
  cardMonthValid: true,
  cardYearValid: true,
  cardCVV: '',
  cardCVVError: '',
  cardCVVValid: true,
  cardDetailsValid: false,
  cardDetails: {},
  selectedCardFieldName: '',
  showNotInteractedFieldsError: false,
  notInteractedFields: {
    encryptedCardNumber: true,
    encryptedExpiryDate: true,
    encryptedSecurityCode: true,
  },
  iframesLoaded: false,
})

export const mutations = {
  updateSelectedCardFieldName(state, name) {
    state.selectedCardFieldName = name
  },
  updateCardNumberError(state, value) {
    state.cardNumberError = value
  },
  updateCardDateError(state, value) {
    state.cardDateError = value
  },
  updateCardCVVError(state, value) {
    state.cardCVVError = value
  },
  updateCardNumberValidity(state, value) {
    if (value) {
      state.notInteractedFields.encryptedCardNumber = false
    }
    state.cardNumberValid = value
  },
  updateCardMonthValidity(state, value) {
    state.cardMonthValid = value
  },
  updateCardYearValidity(state, value) {
    if (value) {
      state.notInteractedFields.encryptedExpiryDate = false
    }
    state.cardYearValid = value
  },
  updateCardCVVValidity(state, value) {
    if (value) {
      state.notInteractedFields.encryptedSecurityCode = false
    }
    state.cardCVVValid = value
  },
  updateCardDetailsValidity(state, value) {
    state.cardDetailsValid = value
  },
  updateCardDetailsWhenValid(state, value) {
    state.cardDetails = value
    state.isFormValid = true
  },
  resetCardState(state, value) {
    state.cardNumber = ''
    state.cardNumberError = ''
    state.cardNumberValid = false
    state.cardDate = ''
    state.cardDateError = ''
    state.cardMonthValid = false
    state.cardYearValid = false
    state.cardCVV = ''
    state.cardCVVError = ''
    state.cardCVVValid = false
    state.cardDetailsValid = false
    state.cardDetails = {}
    state.selectedCardFieldName = ''
    state.showNotInteractedFieldsError = false
    state.notInteractedFields = {
      encryptedCardNumber: true,
      encryptedExpiryDate: true,
      encryptedSecurityCode: true,
    }
    state.iframesLoaded = false
  },
  updateNotInteractedFieldsError(state, value) {
    state.showNotInteractedFieldsError = value
  },
  updateIframesLoadStatus(state, value) {
    state.iframesLoaded = value
  },
}

export const actions = {
  selectedFieldName({ commit }, name) {
    commit('updateSelectedCardFieldName', name)
  },
  setFieldError({ commit }, { fieldType: fType, fieldErr: fErr }) {
    switch (fType) {
      case 'encryptedCardNumber':
        commit('updateCardNumberError', fErr)
        break
      case 'encryptedExpiryDate':
        commit('updateCardDateError', fErr)
        break
      case 'encryptedSecurityCode':
        commit('updateCardCVVError', fErr)
        break
    }
  },
  setFieldValidity({ commit }, fieldsValidity) {
    let cardDetailsValid
    Object.keys(fieldsValidity).map((fType, index) => {
      const validity = fieldsValidity[fType]
      switch (fType) {
        case 'encryptedCardNumber':
          commit('updateCardNumberValidity', validity)
          break
        case 'encryptedExpiryMonth':
          commit('updateCardMonthValidity', validity)
          break
        case 'encryptedExpiryYear':
          commit('updateCardYearValidity', validity)
          break
        case 'encryptedSecurityCode':
          commit('updateCardCVVValidity', validity)
          break
      }
      if (cardDetailsValid === undefined) {
        cardDetailsValid = true
      }
      cardDetailsValid &= validity
    })
    commit('updateCardDetailsValidity', !!cardDetailsValid)
  },
  setCardDetailsWhenValid({ commit }, details) {
    commit('updateCardDetailsWhenValid', details)
  },
  resetState({ commit }, value) {
    commit('resetCardState', value)
  },
  setNotInteractedFieldsError({ commit }, value) {
    commit('updateNotInteractedFieldsError', value)
  },
  setIframesLoadStatus({ commit }, value) {
    commit('updateIframesLoadStatus', value)
  },
  async makeCreatePaymentRequest({ commit }, cardPayRequest) {
    try {
      await paymentClient.createPaymentRequest(cardPayRequest)
      Vue.prototype.$sdk.dispatchGlobal({
        name: 'checkout/paymentSucceed',
      })
    } catch (e) {
      if (e instanceof PaymentError) {
        e.message = e.message
          ? e.message
          : this.app.i18n.t('internalServerError')
      } else {
        e.message = this.app.i18n.t('internalServerError')
      }

      Vue.prototype.$sdk.dispatchGlobal({
        name: 'checkout/paymentFailed',
        data: e.message,
      })
    }
  },
}

export const getters = {
  getSelectedFieldName: (state) => {
    return state.selectedCardFieldName
  },
  getFieldError: (state) => {
    return (fieldType) => {
      switch (fieldType) {
        case 'encryptedCardNumber':
          return state.cardNumberError
        case 'encryptedExpiryDate':
          return state.cardDateError
        case 'encryptedSecurityCode':
          return state.cardCVVError
      }
    }
  },
  getFieldValidity: (state) => {
    return (fieldType) => {
      switch (fieldType) {
        case 'encryptedCardNumber':
          return state.cardNumberValid
        case 'encryptedExpiryDate':
          return state.cardMonthValid && state.cardYearValid
        case 'encryptedSecurityCode':
          return state.cardCVVValid
      }
    }
  },
  getCardDetails: (state) => {
    return state.cardDetails
  },
  getCardDetailsValidity: (state) => {
    return state.cardDetailsValid
  },
  shouldShowNotInteractedFieldError: (state) => {
    return state.showNotInteractedFieldsError
  },
  getNotInteractedFields: (state) => {
    return state.notInteractedFields
  },
  getIframesLoadStatus: (state) => {
    return state.iframesLoaded
  },
}
