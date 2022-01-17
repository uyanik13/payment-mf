<template>
  <div class="card-form-container">
    <div class="t-grid t-grid-cols-12">
      <div class="t-grid t-grid-cols-12 t-col-span-12 t-gap-4">
        <v-form
          id="cc-form"
          ref="form"
          v-model="ccFormIsValid"
          class="t-grid t-grid-cols-12 t-gap-4 t-col-span-12 md:t-col-span-6"
        >
          <v-text-field
            :id="cardFields.cardName"
            v-model="cardValue.cardName"
            :label="$t('cardOwnerName')"
            :rules="cardOwnerNameRules"
            class="t-col-span-12 label-font-color"
            name="cardOwnerName"
            hide-details="auto"
            validate-on-blur
            outlined
            dense
            @blur="formatCardName()"
          ></v-text-field>
          <v-text-field
            :id="cardFields.cardNumber"
            v-model="cardValue.cardNumber"
            :label="$t('cardNumber')"
            :rules="cardNumberRules"
            class="t-col-span-12"
            type="tel"
            hide-details="auto"
            outlined
            validate-on-blur
            dense
            @change="cardNumberChange"
            @keyup="cardNumberOnKeyUp"
            @blur="cardNumberOnKeyBlur"
            @paste="cardNumberOnPaste"
          ></v-text-field>
          <div class="t-col-span-12 t-grid t-grid-cols-12 t-gap-4">
            <div
              id="cardExpireDateMonth_wrapper"
              class="t-col-span-6 xl:t-col-span-4"
            >
              <v-select
                :id="cardFields.cardMonth"
                v-model="cardValue.cardMonth"
                :items="[
                  '01',
                  '02',
                  '03',
                  '04',
                  '05',
                  '06',
                  '07',
                  '08',
                  '09',
                  '10',
                  '11',
                  '12',
                ]"
                append-icon="fa-chevron-down"
                :label="$t('month')"
                hide-details="auto"
                :rules="cardMonthRules"
                dense
                validate-on-blur
                outlined
                class="chevron-down"
                @change="changeYearAndMonth"
              ></v-select>
            </div>
            <div
              id="cardExpireDateYear_wrapper"
              class="t-col-span-6 xl:t-col-span-4"
            >
              <v-select
                :id="cardFields.cardYear"
                v-model="cardValue.cardYear"
                :items="getCardExpireDateYears()"
                :label="$t('year')"
                hide-details="auto"
                :rules="cardYearRules"
                append-icon="fa-chevron-down"
                dense
                validate-on-blur
                outlined
                class="chevron-down"
                @change="changeYearAndMonth"
              ></v-select>
            </div>
            <v-text-field
              :id="cardFields.cardCvv"
              v-model="cardValue.cardCvv"
              :label="$t('cvv')"
              class="t-col-span-6 xl:t-col-span-4"
              type="tel"
              hide-details="auto"
              :rules="cardCvvRules"
              dense
              outlined
              validate-on-blur
              @keyup="formatCvv"
              @paste="cvvOnPaste"
              @blur="formatCvv"
              @input.native="formatCvv"
            ></v-text-field>
          </div>
          <v-checkbox
            id="securePaymentCheckbox"
            v-model="needSecurePayment"
            :label="$t('threeDSecure')"
            :ripple="false"
            class="t-col-span-12 ma-0 pa-0"
            color="modanisa-orange"
            hide-details="auto"
          ></v-checkbox>
          <!-- TODO uncomment after R0 -->
          <v-checkbox
            id="saveMyCardInformation"
            v-model="saveMyCardInformation"
            :label="$t('saveCreditCard')"
            class="t-col-span-12 ma-0 pa-0"
            color="modanisa-orange"
            hide-details="auto"
          ></v-checkbox>
          <!-- <v-text-field
            v-if="saveMyCardInformation"
            id="cardNickName"
            v-model="cardNickName"
            :label="$t('cardNickname')"
            class="t-col-span-12"
            hide-details="auto"
            dense
            outlined
          ></v-text-field> -->
        </v-form>
        <div dir="ltr" class="card-wrapper t-col-span-6"></div>
      </div>
      <hr class="t-col-span-12 t-mt-4 t-mb-6 md:t-mt-6 md:t-mb-4" />
      <InstallmentOptions class="t-col-span-12"></InstallmentOptions>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import luhn from 'luhn'
import creditCardType from 'credit-card-type'
import * as Card from 'card'
import { CreditCardType } from 'credit-card-type/src/types'
import {
  CardInformation,
  CardLabel,
  CardInformationFields,
  CardPayRequest,
} from '@/types/types'
import utils from '@/utility/utils'
import InstallmentOptions from '@/components/InstallmentOptions.vue'

@Component({
  components: { InstallmentOptions },
})
export default class CardForm extends Vue {
  card: any
  ccFormIsValid = false

  mounted(): void {
    if (typeof Card !== 'object') {
      // eslint-disable-next-line no-new
      this.card = new Card({
        form: 'form#cc-form',
        container: '.card-wrapper',
        formSelectors: {
          numberInput: 'input#cardNumber',
          cvcInput: 'input#cardSecurityCode',
          nameInput: 'input#cardOwnerName',
        },
        formatting: false,
        placeholders: {
          number: '**** **** **** ****',
          name: this.$t('nameSurname'),
          cvc: '•••',
          expiry: this.$t('monthYear'),
        },
      })
    }

    const paymentCallback = () => {
      this.makePayment()
    }

    this.$store.commit('addPaymentCallback', {
      name: 'cc',
      callback: paymentCallback,
    })

    this.$store.commit('addPaymentCallback', {
      method: 'credit-card',
      provider: 'iyzico',
      callback: paymentCallback,
    })
  }

  makePayment(): void {
    this.validateForm()
    if (!this.ccFormIsValid) {
      this.$store.dispatch('cardFormValidation', { isValid: false })
      return
    }

    const cardPayRequest: CardPayRequest = {
      checkoutId: this.$store.state.appParams.checkoutId,
      card: {
        ownerName: this.cardValue.cardName ? this.cardValue.cardName : '',
        number: this.cardValue.cardNumber
          ? this.cardValue.cardNumber.replace(/\s+/g, '')
          : '',
        month: this.cardValue.cardMonth
          ? parseInt(this.cardValue.cardMonth)
          : 0,
        year: this.cardValue.cardYear ? this.cardValue.cardYear : 0,
        cvc: this.cardValue.cardCvv ? this.cardValue.cardCvv : '',
      },
      installmentCount: this.$store.state.selectedInstallment,
      saveCardPreference: {
        save: this.saveMyCardInformation,
        nickname: this.cardNickName ? this.cardNickName : '',
      },
      isThreeD: this.needSecurePayment,
    }

    this.$store.dispatch('cardFormValidation', { isValid: true })
    this.$store.dispatch('makeCardPayment', cardPayRequest)
  }

  validateForm(): void {
    const form: any = this.$refs.form
    form.validate()
  }

  expiryInput = ''
  cardNickName = ''
  needSecurePayment = false

  cardValue: CardInformation = {
    cardName: '',
    cardNumber: '',
    cardMonth: null,
    cardYear: null,
    cardCvv: null,
  }

  cardFields: CardInformationFields = {
    cardName: 'cardOwnerName',
    cardNumber: 'cardNumber',
    cardMonth: 'cardExpireDateMonth',
    cardYear: 'cardExpireDateYear',
    cardCvv: 'cardSecurityCode',
  }

  cardLabel: CardLabel = {
    cardName: 'Name Surname',
    cardHolder: 'Card Owner',
    cardMonth: 'MM',
    cardYear: 'YY',
    cardExpires: 'Date',
    cardCvv: 'CVV',
  }

  changeYearAndMonth() {
    const monthValue = this.cardValue.cardMonth ?? '••'

    let yearValue: any
    if (typeof this.cardValue.cardYear === 'number') {
      yearValue = this.cardValue.cardYear % 100
    } else {
      yearValue = '••'
    }
    this.$data.expiryInput = monthValue + '/' + yearValue
    const elem = document.getElementsByClassName('jp-card-expiry')
    if (elem && elem[0]) {
      elem[0].innerHTML = this.$data.expiryInput
    }
  }

  getCardExpireDateYears(): Array<number> {
    const years = []
    const currentYear = new Date().getFullYear()

    for (let i = 0; i <= 10; i++) {
      years.push(i + currentYear)
    }
    return years
  }

  requiredCvvLength = 3

  saveMyCardInformation = true

  formatCardName(): void {
    if (this.cardValue.cardName != null)
      this.cardValue.cardName = this.cardValue.cardName.trim()
  }

  cardNumberChange(value: string): void {
    const cardInfo: Array<CreditCardType> = creditCardType(value)
    const cardType: any = cardInfo.shift()
    if (cardType !== undefined && cardType.code !== undefined) {
      this.requiredCvvLength = cardType.code.size
    }
  }

  cardNumberOnPaste(event: ClipboardEvent): void {
    event.stopPropagation()
    event.preventDefault()

    if (event.clipboardData !== null) {
      this.cardValue.cardNumber = event.clipboardData.getData('Text')
      this.cardNumberOnKeyUp(new KeyboardEvent('keypress', { key: ' ' }))
    }
  }

  cardNumberOnKeyUp(event: KeyboardEvent) {
    const cardNumberField = document.getElementById(
      'cardNumber'
    ) as HTMLInputElement
    const setCardBound = this.card.handlers.setCardType.bind(this.card)
    const inputCardNumber = cardNumberField.value
    const validKeyboardEvents = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
    ]

    if (this.cardValue.cardNumber != null && event.key !== 'Backspace') {
      const initialCursorPos = cardNumberField.selectionStart
      let finalCursorPos = initialCursorPos
      const cardNumber = utils.formatCardNumber(this.cardValue.cardNumber)
      if (cardNumber !== this.cardValue.cardNumber) {
        this.cardValue.cardNumber = cardNumber
        this.$store.dispatch('setCardNumber', cardNumber)
        cardNumberField.value = cardNumber
        if (initialCursorPos != null) {
          const nextCharacter = this.cardValue.cardNumber.slice(
            initialCursorPos - 1,
            initialCursorPos
          )

          finalCursorPos =
            initialCursorPos === inputCardNumber.length
              ? initialCursorPos + 1
              : initialCursorPos
          if (nextCharacter === ' ') {
            finalCursorPos = initialCursorPos + 1
          }
          if (!validKeyboardEvents.includes(event.key)) {
            finalCursorPos = initialCursorPos - 1
          }
          cardNumberField.selectionEnd = finalCursorPos
        }
      }
    }
    const cardType = utils.getCardType(cardNumberField.value)
    setCardBound(event.target, {
      data: cardType,
    })
  }

  cardNumberOnKeyBlur() {
    const cardNumberField = document.getElementById(
      'cardNumber'
    ) as HTMLInputElement

    if (this.cardValue.cardNumber != null) {
      const cardNumber = utils.formatCardNumber(this.cardValue.cardNumber)

      this.cardValue.cardNumber = cardNumber
      this.$store.dispatch('setCardNumber', cardNumber)
      cardNumberField.value = cardNumber
    }
  }

  cvvOnPaste(event: ClipboardEvent) {
    event.stopPropagation()
    event.preventDefault()

    if (event.clipboardData !== null) {
      this.cardValue.cardCvv = event.clipboardData.getData('Text')
      this.formatCvv()
    }
  }

  formatCvv() {
    if (this.cardValue.cardCvv != null) {
      const formattedCvv = this.cardValue.cardCvv.replace(/[^0-9]/g, '')
      this.cardValue.cardCvv = formattedCvv.slice(
        0,
        Math.min(4, formattedCvv.length)
      )
    }
  }

  mandatorySelectRules = [(v: any) => !!v || this.$t('thisFieldIsRequired')]

  cardOwnerNameRules = [
    ...this.mandatorySelectRules,
    (v: any) => v.trim().length > 0 || this.$t('thisFieldIsRequired'),
  ]

  cardNumberRules = [
    ...this.mandatorySelectRules,
    (v: any) =>
      v.replace(' ', '').length > 0
        ? luhn.validate(v) || this.$t('cardNoIsIncorrect')
        : this.$t('thisFieldIsRequired'),
  ]

  cardMonthRules = [...this.mandatorySelectRules]

  cardYearRules = [...this.mandatorySelectRules]

  get cardCvvRules() {
    const response = [
      !!this.cardValue.cardCvv || this.$t('thisFieldIsRequired'),
    ]

    if (this.cardValue.cardCvv) {
      response.push(
        this.cardValue.cardCvv.length === this.requiredCvvLength ||
          this.$t('cvvIsIncorrect')
      )
    }

    return response
  }
}
</script>
<style>
#cardOwnerName {
  margin-top: 5px !important;
}

#cardNumber {
  margin-top: 5px !important;
}

#cardSecurityCode {
  margin-top: 5px !important;
}

@media only screen and (min-width: 769px) and (max-width: 980px) {
  .jp-card {
    min-width: 280px !important;
    width: 90% !important;
    margin-top: 23px !important;
    height: 163px !important;
    margin-left: 20px !important;
  }
  .jp-card-name {
    max-width: 166px !important;
  }
}

@media only screen and (min-width: 1180px) {
  .jp-card {
    min-width: 280px !important;
    width: 90% !important;
    margin-top: 23px !important;
    height: 163px !important;
    margin-left: 20px !important;
  }
  .jp-card-name {
    max-width: 166px !important;
  }
}

@media only screen and (min-width: 980px) and (max-width: 1180px) {
  .jp-card {
    min-width: 234px !important;
    width: 65% !important;
    height: 163px !important;
    margin-top: 23px !important;
    margin-left: 16px !important;
  }

  .jp-card .jp-card-front .jp-card-lower .jp-card-number {
    font-size: 16px !important;
  }

  .jp-card .jp-card-front .jp-card-lower .jp-card-name,
  .jp-card .jp-card-front .jp-card-lower .jp-card-expiry {
    font-size: 12px !important;
  }
  .jp-card-name {
    max-width: 133px !important;
  }
}

@media only screen and (max-width: 769px) {
  .card-wrapper {
    display: none !important;
  }
}

@media only screen and (min-width: 770px) {
  .card-wrapper {
    display: block !important;
  }
}
</style>
