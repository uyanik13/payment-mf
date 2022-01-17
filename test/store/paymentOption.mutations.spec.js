// mutations.spec.js
import { mutations } from '~/store/paymentOption'

// destructure assign `mutations`
const { getPaymentOptionsSuccess, updateSelectedPaymentOption } = mutations

describe('mutations', () => {
  it('getPaymentOptionsSuccess', () => {
    // mock state
    const state = {
      selectedPaymentOption: {},
      paymentOptions: [],
      providerTokens: [],
      getPaymentOptionsError: '',
      sessionId: '',
      sessionToken: '',
    }

    const expPaymentOptions = [
      {
        idx: 0,
        provider: 'adyen',
        method: 'credit-card',
      },
      {
        idx: 1,
        provider: 'braintree',
        method: 'paypal',
      },
    ]
    const expProviderTokens = [
      {
        provider: 'adyen',
        token: 'adyen-token',
      },
      {
        provider: 'braintree',
        token: {
          braintree: 'braintree_token',
        },
      },
    ]

    const expectedSelectedPaymentOption = {
      idx: 1,
      provider: 'braintree',
      method: 'paypal',
      token: {
        braintree: 'braintree_token',
      },
    }

    const paymentOptions = {
      paymentOptions: expPaymentOptions,
      providerTokens: expProviderTokens,
      sessionId: 'dummy_session_id',
      sessionToken: 'dummy_session_token',
      defaultSelectedIdx: 1,
    }
    // apply mutation
    getPaymentOptionsSuccess(state, paymentOptions)
    // assert result
    expect(state.sessionId).toBe('dummy_session_id')
    expect(state.sessionToken).toBe('dummy_session_token')
    expect(state.paymentOptions).toBe(expPaymentOptions)
    expect(state.providerTokens).toBe(expProviderTokens)
    expect(state.selectedPaymentOption).toEqual(expectedSelectedPaymentOption)
  })
  it('updateSelectedPaymentOption', () => {
    // mock state
    const state = {
      selectedPaymentOption: {
        provider: 'braintree',
        method: 'paypal',
        token: {
          braintree: 'braintree_token',
        },
      },
      paymentOptions: [
        {
          idx: 0,
          provider: 'adyen',
          method: 'credit-card',
        },
        {
          idx: 1,
          provider: 'braintree',
          method: 'paypal',
        },
      ],
      providerTokens: [
        {
          provider: 'adyen',
          token: 'adyen-token',
        },
        {
          provider: 'braintree',
          token: {
            braintree: 'braintree_token',
          },
        },
      ],
      getPaymentOptionsError: '',
      sessionId: '',
      sessionToken: '',
    }

    const expectedSelectedPaymentOption = {
      idx: 0,
      provider: 'adyen',
      method: 'credit-card',
      token: 'adyen-token',
    }

    // apply mutation
    updateSelectedPaymentOption(state, 0)

    expect(state.selectedPaymentOption).toEqual(expectedSelectedPaymentOption)
  })
})
