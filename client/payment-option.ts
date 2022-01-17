import { PaymentOptions } from 'client/types'
import axios from 'axios'

const getPaymentOptions = async (
  customerID: string,
  checkoutID: string,
  language: string
): Promise<PaymentOptions> => {
  const path = `/payment/session`
  const baseURL = process.env.api2BaseURL
  const response = await axios.post<PaymentOptions>(
    baseURL + path,
    {
      customerId: customerID + '',
      checkoutId: checkoutID,
      customerLocale: language,
    },
    {
      headers: {
        Accept: 'application/json',
        'x-modanisa-customer-id': customerID,
        'X-Mdns-Platform': 'web',
      },
    }
  )
  if (response.status !== 201) {
    throw new Error('payment api v2 response is not success')
  }
  return response.data
}

export default { getPaymentOptions }
