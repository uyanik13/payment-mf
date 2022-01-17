import axios from 'axios'
import { InstallmentOptions, GetInstallmentOptionsRequest } from '@/types/types'

export const getInstallmentOptions = async (
  binNumber: string,
  installmentOptionsRequest: GetInstallmentOptionsRequest
): Promise<InstallmentOptions> => {
  const path = `/cards/installments/${binNumber}`

  const response = await axios.get<InstallmentOptions>(path, {
    params: installmentOptionsRequest,
    headers: {
      Accept: 'application/json',
    },
    baseURL: process.env.apiBaseURL,
  })

  if (response.status !== 200) {
    throw new Error('installment options api response is not success')
  }

  return response.data
}

export default { getInstallmentOptions }
