import { Given, When, Then } from 'cucumber'

import clickElement from '../support/action/clickElement'
import selectVuetifyOption from '../support/action/selectVuetifyOption'
import openWebsite from '../support/action/openWebsite'
import isExisting from '../support/check/isExisting'
import checkProperty from '../support/check/checkProperty'
import checkElementExists from '../support/check/checkElementExists'
import setWindowSize from '../support/action/setWindowSize'
import { lowerCaseText } from '../support/lib/lowerCaseText'
import { toCamelCase } from '../support/lib/toCamelCase'
import waitForBrowser from '../support/lib/waitForBrowser'
import checkSelected from '../support/check/checkSelected'
import setInputField from '../support/action/setInputField'
import selectOption from '../support/action/selectOption'
import pressButton from '../support/action/pressButton'
import { hasClass } from '../support/lib/hasClass'

const PAYMENT_MF_URL = process.env.PAYMENT_MF_URL || 'http://localhost:3000'

Given('that Esen visits checkout on {string} device', (clientType) => {
  if (lowerCaseText(clientType) === 'desktop') {
    setWindowSize(1920, 1080)
  } else if (lowerCaseText(clientType) === 'mobile') {
    setWindowSize(320, 731)
  }
})

Given(
  'that Esen has selected ship to as {string} on the Modanisa Website',
  (countryName) => {}
)

Given(
  'that Esen has proceeded to address and shipment selection checkout page',
  () => {}
)

Given(
  'Esen sees orders shipped from Modanisa and marketplace enabled Civil supplier',
  () => {}
)

Given('Esen has no saved credit card in her account', () => {})

When('Esen has selected proceed payment after reviewing the order', () => {
  openWebsite('url', PAYMENT_MF_URL)
  browser.execute("window.$nuxt.$store.commit('updateAppName', 'card-form')")
  waitForBrowser()
})

Then(
  'Esen should be able to fill mandatory, name on card,card number, month & year, CVV fields',
  () => {
    let selector = '*[id="cardOwnerName"]'
    isExisting(selector)
    checkProperty(false, 'type', selector, false, 'text')

    selector = '*[id="cardNumber"]'
    isExisting(selector)
    checkProperty(false, 'type', selector, false, 'tel')

    selector = '*[id="cardExpireDateMonth"]'
    checkElementExists('an', selector)

    selector = '*[id="cardExpireDateYear"]'
    checkElementExists('an', selector)

    selector = '*[id="cardSecurityCode"]'
    isExisting(selector)
    checkProperty(false, 'type', selector, false, 'tel')
  }
)

Then('Esen should be able to see 3d secure payment option', () => {
  checkElementExists('an', '*[id="securePaymentCheckbox"]')
})

Then(
  'Esen should be able to see Save my card information option is pre-selected',
  () => {
    const selector = '*[id="saveMyCardInformation"]'
    checkElementExists('an', selector)
    checkSelected(selector, false)
  }
)

Then('Esen should be able to see the optional Card nickname field', () => {
  const selector = '*[id="cardNickName"]'
  isExisting(selector)
  checkProperty(false, 'type', selector, false, 'text')
})

Then(
  'Esen should see the installment options section with title & view all installment options link',
  () => {
    checkElementExists('an', 'div[id="installment-options"]')
    checkElementExists('an', 'a[id="view-all-bank-options"]')
    checkElementExists('an', 'h2[id="installment-options-title"]')
  }
)

Then(
  'Esen should see the installment options section with view all installment options link',
  () => {
    checkElementExists('an', 'div[id="installment-options"]')
    checkElementExists('an', 'a[id="view-all-bank-options"]')
  }
)

Then(
  'Esen is typing {string} card information in the {string}',
  (inputValue, inputName) => {
    const inputSelector = `input[id="${toCamelCase(inputName)}"]`
    clickElement('click', 'element', inputSelector)
    do {
      pressButton('Backspace')
    } while ($(inputSelector).getValue().length > 0)
    setInputField('setValue', inputValue, inputSelector)
  }
)

Then(
  'Esen is select {string} card information in the {string}',
  (inputValue, inputName) => {
    selectVuetifyOption(
      `div[id="${toCamelCase(inputName)}_wrapper"]`,
      inputValue
    )
  }
)

Then(
  'Esen should {string} on {string} reflecting simultaneously on the card animation',
  (inputValue, labelName) => {
    let actualString = ''

    switch (labelName) {
      case 'Card Owner Name':
        inputValue = inputValue.toUpperCase()
        actualString = $('div.jp-card-name').getText()
        break
      case 'Card Number':
        actualString = $('div.jp-card-number').getText().replace(/\s/g, '')
        break
      case 'Card Expire Date Month':
        actualString = $('div.jp-card-expiry').getText().split('/').shift()
        break
      case 'Card Expire Date Year':
        inputValue = inputValue.substr(inputValue.length - 2)
        actualString = $('div.jp-card-expiry').getText().split('/').pop()
        break
      case 'Card Security Code':
        clickElement('click', 'element', '#cardSecurityCode')
        waitForBrowser()
        actualString = $('div.jp-card-lower .jp-card-cvc').getHTML(false)
        break
    }

    expect(actualString).toEqual(
      inputValue,
      `Expected text to be "${actualString}" but found "${inputValue}" on ${labelName}`
    )
  }
)

Given(
  'Esen is on add new credit card form in Payment Option Selection page',
  () => {
    const inputSelector = 'input[id="useANewCard"]'
    if ($(inputSelector).isExisting()) {
      $(inputSelector).click()
    }
  }
)

When('Esen clicks another field or area on page', () => {
  waitForBrowser()
  clickElement('click', 'element', 'body')
  waitForBrowser()
})

Then(
  'Esen should see {string} message on {string}',
  (errorMessage, inputName) => {
    const inputSelector = $(`input[id="${toCamelCase(inputName)}"]`)

    let errorSelector

    if (hasClass(inputSelector.$('..'), 'v-select__selections')) {
      errorSelector = inputSelector
        .$('..')
        .$('..')
        .$('..')
        .$('..')
        .$('.v-messages__message')
    } else {
      errorSelector = inputSelector
        .$('..')
        .$('..')
        .$('..')
        .$('.v-messages__message')
    }

    expect(errorSelector.getText()).toEqual(errorMessage)
  }
)

Then('Esen should see no error message on {string}', (inputName) => {
  const inputSelector = $(`input[id="${toCamelCase(inputName)}"]`)
    .$('..')
    .$('..')
    .$('..')
    .$('.v-messages__message')

  expect(inputSelector.isExisting()).toEqual(false)
})

Then(
  'Esen should see credit {string} updated with logo on card animation',
  (cardTypeName) => {
    const selector = $('.jp-card-identified')

    const className = `jp-card-${cardTypeName.toLowerCase()}`

    expect(selector.getAttribute('class')).toContain(className)
  }
)

Given('Esen sees the Save my card information option is selected', () => {
  const inputSelector = '*[id="saveMyCardInformation"]'
  if (!$(inputSelector).isSelected()) {
    $(inputSelector).$('..').$('.v-input--selection-controls__ripple').click()
  }
})

When('Esen unmarks Save my credit card information for future orders', () => {
  const inputSelector = '*[id="saveMyCardInformation"]'
  if ($(inputSelector).isSelected()) {
    $(inputSelector).$('..').$('.v-input--selection-controls__ripple').click()
  }
})

When('Esen Placed her order', () => {
  const inputSelector = '*[id="placeOrder"]'
  $(inputSelector).click()
})

When(
  'Esen reselects Save my credit card information for future orders option',
  () => {
    const inputSelector = '*[id="saveMyCardInformation"]'
    $(inputSelector).$('..').$('.v-input--selection-controls__ripple').click()
  }
)

Then("Esen shouldn't be able to see {string} field", (inputName) => {
  const inputSelector = `input[id="${toCamelCase(inputName)}"]`

  checkElementExists('no', inputSelector)
})

Then('Esen should be able to see {string} field', (inputName) => {
  const inputSelector = `input[id="${toCamelCase(inputName)}"]`

  checkElementExists('an', inputSelector)
})

Given(
  'Esen typed {string} card information in the {string}',
  (inputValue, inputName) => {
    const inputSelector = `input[id="${toCamelCase(inputName)}"]`
    clickElement('click', 'element', inputSelector)
    do {
      pressButton('\uE003\t')
    } while ($(inputSelector).getValue().length > 0)
    setInputField('setValue', inputValue, inputSelector)
  }
)

Given(
  'Esen selected {string} card information in the {string}',
  (inputValue, inputName) => {
    try {
      selectOption(
        'value',
        inputValue,
        `select[id="${toCamelCase(inputName)}"]`
      )
    } catch (e) {
      selectVuetifyOption(
        `div[id="${toCamelCase(inputName)}_wrapper"]`,
        inputValue
      )
    }
  }
)

Given('Esen unmarked the Save my card information option', () => {
  const inputSelector = '*[id="saveMyCardInformation"]'
  if ($(inputSelector).isSelected()) {
    $(inputSelector).$('..').$('.v-input--selection-controls__ripple').click()
  }
})
Given("Esen didn't select secure payment option", () => {
  const inputSelector = '*[id="securePaymentCheckbox"]'
  if ($(inputSelector).isSelected()) {
    $(inputSelector).$('..').$('.v-input--selection-controls__ripple').click()
  }
})
