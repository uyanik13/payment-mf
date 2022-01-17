export interface LegacyApiResponse {
  success: boolean
  data: any
}

export interface Country {
  id: number
  name: string
}

export interface City {
  id: number
  name: string
}

export interface District {
  id: number
  countyName: string
}

export interface Address {
  name?: string | null
  surname?: string | null
  email?: string | null
  phoneCountryCode?: string | null
  phoneNumber?: string | null
  addressTitle?: string | null
  address?: string | null
  city?: number | null
  country?: number | null
  districtName?: string | null
  postalCode?: string | null
  isBillingAddress?: boolean | true
  isDefaultAddress?: boolean | true
}

export interface CardInformation {
  cardName?: string | null
  cardNumber?: string | null
  cardMonth?: string | null
  cardYear?: number | null
  cardCvv?: string | null
}

export interface CardInformationFields {
  cardName?: string | null
  cardNumber?: string | null
  cardMonth?: string | null
  cardYear?: string | null
  cardCvv?: string | null
}

export interface CardLabel {
  cardName?: string | null
  cardHolder?: string | null
  cardMonth?: string | null
  cardYear?: string | null
  cardExpires?: string | null
  cardCvv?: string | null
}

export interface InstallmentOption {
  installmentNumber: number
  monthly: number
  total: number
}

export interface InstallmentOptions {
  installments: Array<InstallmentOption>
}

export interface Money {
  amount: number
  currency: string
}

export interface CardPayRequestCard {
  ownerName: string
  number: string
  year: number
  month: number
  cvc: string
}

export interface CardPayRequestSavePreference {
  save: boolean
  nickname: string
}

export interface CardPayRequest {
  checkoutId: string
  card: CardPayRequestCard
  saveCardPreference: CardPayRequestSavePreference
  installmentCount: number
  isThreeD: boolean
}

export interface GetInstallmentOptionsRequest {
  price: number
  categories: Array<number>
}

export interface PaymentResponse {
  redirectUrl: string | null
}

export interface PaymentMetaResponse {
  errorID: string
  message: string
}

export interface GetPaymentOptionRequest {
  checkoutId: string
  customerId: string
}
