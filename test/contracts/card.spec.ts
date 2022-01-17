import { InteractionObject, Pact } from '@pact-foundation/pact'
import { pactWith } from 'jest-pact'
import { like, term } from '@pact-foundation/pact/src/dsl/matchers'
import { cardPay } from '@/client/card'
import { getInstallmentOptions } from '@/client/installment-options'
import {
  CardPayRequest,
  GetInstallmentOptionsRequest,
  InstallmentOptions,
  PaymentResponse,
} from '@/types/types'

pactWith(
  { cors: true, consumer: 'payment-mf', provider: 'payment-api' },
  (provider: Pact) => {
    describe('Get installments by bin number', () => {
      const binNumber = '554960'
      let installmentOptionsRequest: GetInstallmentOptionsRequest

      beforeEach(() => {
        process.env.apiBaseURL = provider.mockService.baseUrl

        installmentOptionsRequest = {
          price: 110,
          categories: [1, 2],
        }
      })

      it('success installments', async () => {
        const expectedResponse: InstallmentOptions = {
          installments: [
            {
              installmentNumber: 1,
              monthly: 110,
              total: 110,
            },
            {
              installmentNumber: 2,
              monthly: 55,
              total: 110,
            },
          ],
        }

        const interaction: InteractionObject = {
          state: 'Customer give card bin number',
          uponReceiving: 'installment list',
          withRequest: {
            method: 'GET',
            path: term({
              generate: `/cards/installments/${binNumber}`,
              matcher: '/cards/installments/[0-9]+',
            }),
            query: `price=${installmentOptionsRequest.price}&categories[]=${installmentOptionsRequest.categories[0]}&categories[]=${installmentOptionsRequest.categories[1]}`,
          },
          willRespondWith: {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: like(expectedResponse),
          },
        }
        await provider.addInteraction(interaction)

        const apiResponse = await getInstallmentOptions(
          binNumber,
          installmentOptionsRequest
        )

        expect(apiResponse).toEqual(expectedResponse)
      })
    })

    describe('Pay with card', () => {
      let cardPayRequest: CardPayRequest

      beforeEach(() => {
        process.env.apiBaseURL = provider.mockService.baseUrl

        cardPayRequest = {
          checkoutId: '98217afb-e396-43f7-9a49-cf0dfe9093bb',
          card: {
            ownerName: 'krishna kumar',
            number: '1122334455667788',
            month: 5,
            year: 2024,
            cvc: '000',
          },
          installmentCount: 1,
          saveCardPreference: {
            save: true,
            nickname: 'krishna nickname',
          },
          isThreeD: true,
        }
      })

      const expectedResponse: PaymentResponse = {
        redirectUrl:
          'http://marketplace-checkout-staging.modanisa.net/payments/98217afb-e396-43f7-9a49-cf0dfe9093bb/threedsecure',
      }

      it('success payment', async () => {
        const interaction: InteractionObject = {
          state: 'make card payment request',
          uponReceiving: 'success payment',
          withRequest: {
            method: 'POST',
            path: '/cards/payments',
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              Authorization: 'Bearer token',
              'Accept-Language': 'TR',
            },
            body: like(cardPayRequest),
          },
          willRespondWith: {
            status: 201,
            body: like(expectedResponse),
            headers: { 'Content-Type': 'application/json' },
          },
        }
        await provider.addInteraction(interaction)

        await cardPay('TR', 'token', cardPayRequest)
      })
    })
  }
)
