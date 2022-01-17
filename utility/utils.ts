import creditCardType from 'credit-card-type'

const formatCardNumber = (inputCardNumber: string): string => {
  let cardNumber = inputCardNumber.replace(/[^0-9]/g, '')
  let formattedCardNumber = ''
  let startingIndex = 0
  let endingPosition = 4
  if (cardNumber.length > 16) cardNumber = cardNumber.slice(0, 16)
  if (cardNumber.length < 4) return cardNumber
  while (endingPosition <= cardNumber.length) {
    formattedCardNumber += cardNumber.slice(startingIndex, endingPosition) + ' '
    startingIndex = endingPosition
    endingPosition += 4
  }

  if (cardNumber.length % 4 !== 0) {
    formattedCardNumber += cardNumber.slice(startingIndex, cardNumber.length)
  }

  return formattedCardNumber.trim()
}

const isTroyCard = (cardNumber: string): boolean => {
  const troyRegex = /^9792/
  return troyRegex.test(cardNumber)
}

const getCardType = (cardNumber: string): string => {
  if (cardNumber === null || cardNumber === '') return ''

  const cardTypeArray = creditCardType(cardNumber)
  let cardType = ''

  if (cardTypeArray != null && cardTypeArray.length > 0) {
    cardType = cardTypeArray[0].type
  } else if (isTroyCard(cardNumber)) {
    cardType = 'troy'
  }
  if (cardType === 'american-express') {
    cardType = 'amex'
  }
  return cardType
}

export default { formatCardNumber, getCardType }
