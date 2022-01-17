export interface PaymentOption {
  idx: number
  provider: string
  method: string
  label: string
  iconURL: string
}

export interface ProviderToken {
  provider: string
  token: any
  params: any
}

export interface PaymentOptions {
  paymentOptions: PaymentOption[]
  defaultSelectedIdx: number
  providerTokens: ProviderToken[]
  sessionId: string
  sessionToken: string
}

export interface CreatePaymentRequest {
  customerId: string
  checkoutId: string
  sessionId: string
  intentId: string
  sessionToken: string
  paymentProvider: string
  paymentMethod: string
  paymentMethodDetails: any
  returnURL: string
  customerLocale: string
}

export interface CreatePaymentResponse {
  paymentIntentId: string
  pspRef: string
  action: any
}

export interface CreatePaymentSessionRequest {
  checkoutId: string
  customerId: string
  customerLocale: string
}
