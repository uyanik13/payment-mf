import 'whatwg-fetch'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import VueI18n from 'vue-i18n'
import flushPromises from 'flush-promises'
import CardForm from '@/components/CardForm.vue'
import { actions, getters, state, mutations } from '@/store'
import * as config from '~/test/components/config'
import installmentClient from '~/client/installment-options'
import { InstallmentOptions } from '~/types/types'

jest.mock('@/client/installment-options')

describe('Card form component test', () => {
  Vue.use(Vuex)
  Vue.use(Vuetify)
  let localVue: typeof Vue
  let vuetify: any
  let store: any
  let i18n: VueI18n
  let wrapper: Wrapper<Vue>
  const { getInstallmentOptions } = installmentClient as jest.Mocked<
    typeof installmentClient
  >

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuetify)
    i18n = config.initI18N(localVue)
    vuetify = new Vuetify()
    store = new Vuex.Store({
      actions,
      getters,
      state,
      mutations,
    })

    wrapper = mount(CardForm, {
      mocks: {
        $store: {
          mutations: {
            setCardNumber: getInstallmentOptions('', {
              price: 2,
              categories: [3],
            }),
          },
        },
      },
      localVue,
      i18n,
      vuetify,
      store,
    })

    wrapper.vm.$nextTick()
    flushPromises()
  })

  afterEach(() => {
    getInstallmentOptions.mockClear()
  })

  test('Given Card Form With Country Turkey When card form loads Then should show all form fields', () => {
    expect(wrapper.find('#cardOwnerName').exists()).toBeTruthy()
    expect(wrapper.find('#cardNumber').exists()).toBeTruthy()
    expect(wrapper.find('#cardExpireDateMonth').exists()).toBeTruthy()
    expect(wrapper.find('#cardExpireDateYear').exists()).toBeTruthy()
    expect(wrapper.find('#cardSecurityCode').exists()).toBeTruthy()
    expect(wrapper.find('#securePaymentCheckbox').exists()).toBeTruthy()
    // TODO uncomment after R0
    expect(wrapper.find('#saveMyCardInformation').exists()).toBeTruthy()
    // expect(wrapper.find('#cardNickName').exists()).toBeTruthy()
  })

  test('Given Card Form With Country Turkey When card form loads Then Save my card information should prechecked', () => {
    expect(wrapper.vm.$data.saveMyCardInformation).toBeTruthy()
  })

  test.skip('Given Card Form With Country Turkey When Save my card information unmarked Then Card Nick Name should not be appear', async () => {
    wrapper.vm.$data.saveMyCardInformation = false

    await wrapper.vm.$nextTick()

    expect(wrapper.find('#cardNickName').exists()).toBeFalsy()
  })

  test.skip('Given Card Form With Country Turkey When Save my card information marked Then Card Nick Name should be appear', async () => {
    wrapper.vm.$data.saveMyCardInformation = true

    await wrapper.vm.$nextTick()

    expect(wrapper.find('#cardNickName').exists()).toBeTruthy()
  })

  test.skip('Given Card Form With Country Turkey When card number filled Then Installment Options will change', async () => {
    const installmentOptions: InstallmentOptions = {
      installments: [
        {
          installmentNumber: 1,
          monthly: 50,
          total: 50,
        },
        {
          installmentNumber: 2,
          monthly: 26,
          total: 52,
        },
      ],
    }

    getInstallmentOptions.mockResolvedValue(installmentOptions)

    wrapper.vm.$data.cardValue.cardNumber = '554960'

    wrapper.find('#cardNumber').trigger('cardNumberOnKeyUp')

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getInstallmentOptions).toHaveBeenCalled()
  })

  test.skip('When card month changed Then card ui will be effected', async () => {
    wrapper.vm.$data.cardValue.cardMonth = '12'

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    wrapper.vm.changeYearAndMonth()

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.vm.$data.expiryInput).toEqual('12/••')
  })

  test.skip('When card year changed Then card ui will be effected', async () => {
    wrapper.vm.$data.cardValue.cardYear = 2025

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    wrapper.vm.changeYearAndMonth()

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.vm.$data.expiryInput).toEqual('••/25')
  })

  test.skip('When card month and year changed Then card ui will be effected', async () => {
    wrapper.vm.$data.cardValue.cardMonth = '12'
    wrapper.vm.$data.cardValue.cardYear = 2025

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    wrapper.vm.changeYearAndMonth()

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.vm.$data.expiryInput).toEqual('12/25')
  })

  test.skip('When amex card filled to card number Then required cvv length need to be 4', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    wrapper.vm.cardNumberChange('370000')

    expect(wrapper.vm.$data.requiredCvvLength).toEqual(4)
  })

  test.skip('When cvv number filled Then cvv validation rules will be return array', () => {
    wrapper.vm.$data.cardValue.cardCvv = '123'

    wrapper.find('#cardSecurityCode').trigger('keyup')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cardCvvRules = wrapper.vm.cardCvvRules

    expect(cardCvvRules).toBeInstanceOf(Array)
    expect(cardCvvRules.length).toEqual(2)
  })
})
