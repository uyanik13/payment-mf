import 'whatwg-fetch'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

import { createLocalVue, mount } from '@vue/test-utils'
import VueI18n from 'vue-i18n'
import flushPromises from 'flush-promises'
import InstallmentOptions from '@/components/InstallmentOptions.vue'
import * as config from '@/test/components/config'
import { actions, getters, state, mutations } from '@/store'
import { InstallmentOptions as InstallmentOptionsType } from '~/types/types'

describe('Installment Options component test', () => {
  Vue.use(Vuex)
  Vue.use(Vuetify)
  let localVue: typeof Vue
  let vuetify: any
  let store: any
  let i18n: VueI18n

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
  })

  test('Installment options component should be rendered for multiple installments', async () => {
    const installmentOptions: InstallmentOptionsType = {
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

    store.state.binInstallmentOptions = installmentOptions

    const wrapper = mount(InstallmentOptions, {
      localVue,
      i18n,
      vuetify,
      store,
    })

    await wrapper.vm.$nextTick()
    await flushPromises()
  })

  test('Installment options component should be rendered for single installment', async () => {
    const installmentOptions: InstallmentOptionsType = {
      installments: [
        {
          installmentNumber: 1,
          monthly: 50,
          total: 50,
        },
      ],
    }

    store.state.binInstallmentOptions = installmentOptions

    const wrapper = mount(InstallmentOptions, {
      localVue,
      i18n,
      vuetify,
      store,
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.vm.$data.selectedInstallment).toEqual(1)
  })

  test('Installment options component should be rendered for no installment', async () => {
    store.state.binInstallmentOptions.installments = undefined

    const wrapper = mount(InstallmentOptions, {
      localVue,
      i18n,
      vuetify,
      store,
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.vm.$data.selectedInstallment).toEqual(1)
  })

  test('Installments must loaded from store', () => {
    const installmentOptions: InstallmentOptionsType = {
      installments: [
        {
          installmentNumber: 1,
          monthly: 50,
          total: 50,
        },
      ],
    }

    store.state.binInstallmentOptions = installmentOptions

    const wrapper = mount(InstallmentOptions, {
      localVue,
      i18n,
      vuetify,
      store,
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const actualInstallmentOptions = wrapper.vm.installmentOptions

    expect(actualInstallmentOptions).toEqual(installmentOptions)
  })
})
