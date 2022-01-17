import axios, { AxiosError } from 'axios'
import { CardPayRequest } from '@/types/types'
import {
  InternalServerError,
  PaymentError,
  ServiceUnavailableError,
} from '~/types/error'

export interface PaymentErrorDetails {
  description: string
}
export interface PaymentErrorResponse {
  status: number
  message: string
  details: PaymentErrorDetails
}

export const cardPay = async (
  language: string,
  token: string,
  cardPayRequest: CardPayRequest
): Promise<any> => {
  try {
    const response = await axios.post('cards/payments', cardPayRequest, {
      baseURL: process.env.apiBaseURL,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Accept-Language': language,
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    const errorResponse = (error as AxiosError<PaymentErrorResponse>).response

    switch (errorResponse?.status) {
      case 402:
        throw new PaymentError(errorResponse?.data.details.description)
      case 500:
        throw new InternalServerError()
      case 503:
        throw new ServiceUnavailableError()
      default:
        throw new Error(errorResponse?.data.message)
    }
  }
}
