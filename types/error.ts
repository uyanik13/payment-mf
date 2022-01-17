export class InternalServerError extends Error {
  constructor(m?: string) {
    super(m)
    Object.setPrototypeOf(this, InternalServerError.prototype)
  }
}

export class ServiceUnavailableError extends Error {
  constructor(m?: string) {
    super(m)
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype)
  }
}

export class PaymentError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, PaymentError.prototype)
  }
}
