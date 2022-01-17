import axios, { AxiosError } from 'axios'
import { CreatePaymentRequest, CreatePaymentResponse } from './types'
import {
  InternalServerError,
  PaymentError,
  ServiceUnavailableError,
} from '~/types/error'
import { PaymentErrorResponse } from '~/client/card'

const createPayment = async (
  request: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  try {
    const response = await axios.post(
      process.env.api2BaseURL + `/payment/` + request.paymentProvider,
      request,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-modanisa-customer-id': request.customerId,
        },
      }
    )

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

const createPaymentIntent = async (request: any): Promise<any> => {
  try {
    const response = await axios.post<any>(
      process.env.api2BaseURL + `/payment-intent`,
      request,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-modanisa-customer-id': request.customerId,
        },
      }
    )
    return response.data.id
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

const createPaymentRequest = async (
  cpr: CreatePaymentRequest
): Promise<any> => {
  try {
    const response = await axios.post(`/payment/${cpr.paymentProvider}`, cpr, {
      baseURL: process.env.api2BaseURL,
    })
    return response.data
  } catch (error) {
    const errorResponse = (error as AxiosError<PaymentErrorResponse>).response
    switch (errorResponse?.status) {
      case 422:
        throw new PaymentError(errorResponse?.data.message)
      case 500:
        throw new InternalServerError()
      default:
        throw new Error(errorResponse?.data.message)
    }
  }
}

export default { createPayment, createPaymentIntent, createPaymentRequest }
