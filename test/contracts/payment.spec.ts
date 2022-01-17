import { InteractionObject, Pact } from '@pact-foundation/pact'
import { pactWith } from 'jest-pact'
import { like } from '@pact-foundation/pact/src/dsl/matchers'
import paymentClient from '@/client/payment'
import paymentOptionClient from '@/client/payment-option'
import auth from '~/plugins/auth'
import {
  CreatePaymentRequest,
  PaymentOptions,
  PaymentOption,
  CreatePaymentSessionRequest,
  ProviderToken,
} from '~/client/types'

pactWith(
  { cors: true, consumer: 'payment-mf', provider: 'payment-api-v2' },
  (provider: Pact) => {
    const createPaymentIntentRequest = {
      checkoutId: 'checkout-id',
      sessionId: 'session-id',
      sessionToken: 'session-token',
      customerId: 'customer-id',
      paymentMethod: 'paypal',
      paymentProvider: 'braintree',
      customerLocale: 'EN',
    }
    const expectedResponse = {
      id: 'intent-id',
    }

    describe('Create payment intent id for a given customer id', () => {
      beforeEach(() => {
        const store: any = {
          state: {
            auth: {
              token: 'token',
            },
          },
        }
        auth({ store })
        const interaction: InteractionObject = {
          state: 'Create payment intent',
          uponReceiving: 'a post request to create payment intent',
          withRequest: {
            method: 'POST',
            path: '/payment-intent',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'x-modanisa-customer-id': createPaymentIntentRequest.customerId,
            },
            body: like(createPaymentIntentRequest),
          },
          willRespondWith: {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
            body: like(expectedResponse),
          },
        }
        return provider.addInteraction(interaction)
      })

      it('returns the payment intent id', async () => {
        process.env.api2BaseURL = provider.mockService.baseUrl
        await paymentClient.createPaymentIntent(createPaymentIntentRequest)
      })
    })

    describe('Get payment option by given customer and checkout id', () => {
      const createPaymentSessionRequest: CreatePaymentSessionRequest = {
        checkoutId: '342442',
        customerId: '238384',
        customerLocale: 'tr',
      }

      beforeEach(() => {
        process.env.apiBaseURL = provider.mockService.baseUrl
      })

      it('success payment option get', async () => {
        const expectedPaymentOption: PaymentOption = {
          idx: 1,
          provider: 'iyzico',
          method: 'credit-card',
          iconURL:
            'https://fns.modanisa.com/r/pro2/banner-upload/2021-08/2ba8904ff5e8927265180702108d71bf.png',
          label: 'Kredi / Banka Kartı',
        }

        const expectedProviderToken: ProviderToken = {
          params: 'params',
          provider: 'paypal',
          token: {},
        }

        const expectedResponse: PaymentOptions = {
          sessionId: 'e6eb0507-9456-40de-a38b-686e8615b3af_1635232781239336381',
          sessionToken:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRpdGlvbmFsRGF0YSI6eyJwYXltZW50LW9wdGlvbnMiOlt7ImlkeCI6MCwicHJvdmlkZXIiOiJpeXppY28iLCJtZXRob2QiOiJjcmVkaXQtY2FyZCIsImljb25VUkwiOiJodHRwczovL2Zucy5tb2RhbmlzYS5jb20vci9wcm8yL2Jhbm5lci11cGxvYWQvMjAyMS0wOC8yYmE4OTA0ZmY1ZTg5MjcyNjUxODA3MDIxMDhkNzFiZi5wbmciLCJsYWJlbCI6IktyZWRpIC8gQmFua2EgS2FydMSxIn1dLCJzZXNzaW9uSWQiOiJlNmViMDUwNy05NDU2LTQwZGUtYTM4Yi02ODZlODYxNWIzYWZfMTYzNTIzMjc4MTIzOTMzNjM4MSJ9LCJleHAiOjE2MzUyMzYzODEsImlzcyI6InN0YWdpbmcubW9kYW5pc2EuY29tIiwic3ViIjoic3RhZ2luZy5tb2RhbmlzYS5jb20ifQ.Z7OHXlh0VkVIuLxLu4qL4J210TIU8aoYsAn5O_fj4UxGACdK7KaekEIVXkDZRGa-_icq4Mg22TcfvaiKGl674AlQOG2qBBpYHaNdrjDuUVeWWMV-hRUhX7oS8a3UNz2vUyPy5CynBxkJ7w00_qXqS6PNV0ZxKHuaUShAfm0OQbsR-HQuIKc3gy6qPStPKNMgrVa8fZykLU1MpqGPHGH0QR-8DCimwRuTSaXVVrEdvnhfuXXi0J49WB4IjM-r78qdnSaQ52GiWqUJX39_oF-OAzp8rc3ujQ1SVobQ5mmZoPQIecgsRozMweDCs2BvtJLE1Pa2FajMEfbnUuvjgNdcKQ',
          defaultSelectedIdx: 0,
          paymentOptions: [expectedPaymentOption],
          providerTokens: [expectedProviderToken],
        }

        const interaction: InteractionObject = {
          state: 'Esen is trying to get payment option',
          uponReceiving: 'a post request to get payment options',
          withRequest: {
            method: 'POST',
            path: '/payment/session',
            headers: {
              Accept: 'application/json',
              'x-modanisa-customer-id': createPaymentSessionRequest.customerId,
              'X-Mdns-Platform': 'web',
            },
            body: like(createPaymentSessionRequest),
          },
          willRespondWith: {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
            body: like(expectedResponse),
          },
        }
        await provider.addInteraction(interaction)

        const apiResponse = await paymentOptionClient.getPaymentOptions(
          createPaymentSessionRequest.customerId,
          createPaymentSessionRequest.checkoutId,
          createPaymentSessionRequest.customerLocale
        )

        expect(apiResponse).toEqual(expectedResponse)
      })
    })

    describe('Make payment', () => {
      const createPaymentRequest: CreatePaymentRequest = {
        checkoutId: '342442',
        customerId: '238384',
        sessionId: '347347',
        intentId: '342734',
        paymentMethodDetails: {
          token: '4853954',
        },
        paymentMethod: 'paypal',
        paymentProvider: 'paypal',
        customerLocale: 'tr',
        returnURL: 'http://asdssdsd.com',
        sessionToken: '45475475',
      }

      beforeEach(() => {
        process.env.apiBaseURL = provider.mockService.baseUrl
      })

      it('success payment', async () => {
        const expectedResponse = {
          paymentIntentId:
            '9b09ba44-ef4a-41c8-a67e-00acc79e7376_1635233299753271740',
          pspRef: '',
          action: null,
        }

        const interaction: InteractionObject = {
          state: 'Esen is trying to make payment',
          uponReceiving: 'a post request to make successful payment',
          withRequest: {
            method: 'POST',
            path: `/payment/${createPaymentRequest.paymentProvider}`,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'x-modanisa-customer-id': createPaymentRequest.customerId,
            },
            body: like(createPaymentRequest),
          },
          willRespondWith: {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
            body: like(expectedResponse),
          },
        }
        await provider.addInteraction(interaction)

        const apiResponse = await paymentClient.createPayment(
          createPaymentRequest
        )

        expect(apiResponse).toEqual(expectedResponse)
      })
    })
  }
)
