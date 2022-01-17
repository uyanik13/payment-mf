import utils from '~/utility/utils'

describe('Card form component test', () => {
  test('Given card number without spaces Then it should return the formatted card number with 4 digits and space', () => {
    const actual = utils.formatCardNumber('1234567812345678')
    expect(actual).toBe('1234 5678 1234 5678')
  })

  test('Given a card number with less than or equal to 4 digits Then it should return the card number as it is', () => {
    const actual = utils.formatCardNumber('123')
    expect(actual).toBe('123')
  })

  test('Given a card number with more than 16 digits Then it should ignore the extra digits', () => {
    const actual = utils.formatCardNumber('12345678123456789999')
    expect(actual).toBe('1234 5678 1234 5678')
  })

  test('Given a card number with 10 digits Then it should return 3 set of numbers', () => {
    const actual = utils.formatCardNumber('1234567812')
    expect(actual).toBe('1234 5678 12')
  })

  test('Given a card number with non numeric characters Then it should ignore the non numeric characters', () => {
    const actual = utils.formatCardNumber('12w3456e78f12')
    expect(actual).toBe('1234 5678 12')
  })
})
