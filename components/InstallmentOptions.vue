<template>
  <div id="installment-options">
    <div
      id="installment_dropdown_wrapper"
      class="t-col-span-12 t-mb-4 md:t-mb-0 sm:t-block md:t-hidden"
    >
      <v-select
        v-model="selectedInstallment"
        :label="$t('installmentOptions')"
        :items="installmentOptionsForSelectBox"
        item-text="name"
        item-value="value"
        hide-details="auto"
        dense
        outlined
      />
      <a
        id="view-all-bank-options"
        class="t-hidden t-col-span-12 modanisa-orange--text t-text-sm t-font-bold"
      >
        {{ $t('allBankOptions') }}
      </a>
    </div>
    <div class="sm:t-hidden md:t-block">
      <div class="t-flex t-justify-between">
        <div id="installment-options-title" class="t-font-bold">
          {{ $t('installmentOptions') }}
        </div>
        <div
          id="view-all-bank-options"
          class="t-hidden t-self-center t-font-bold t-text-orange-500 t-cursor-pointer"
        >
          {{ $t('allBankOptions') }}
        </div>
      </div>
    </div>
    <div
      v-if="showInstallmentOptions"
      class="t-grid t-grid-cols-12 t-gap-4 t-col-span-12 md:t-block sm:t-hidden t-text-sm t-mt-4"
    >
      <div
        class="t-bg-table-zebra-dark t-grid t-grid-cols-12 t-col-span-12 t-font-bold"
      >
        <div class="t-col-span-4 t-mx-4 t-my-3 t-text-start">
          {{ $t('installment') }}
        </div>
        <div class="t-col-span-4 t-mx-4 t-my-3 t-text-center">
          {{ $t('monthly') }}
        </div>
        <div class="t-col-span-4 t-mx-4 t-my-3 t-text-end">
          {{ $t('totalPayment') }}
        </div>
      </div>
      <v-radio-group v-model="selectedInstallment" class="ma-0">
        <v-radio
          v-for="installmentOption in installmentOptions.installments"
          :key="installmentOption.installmentNumber"
          :ripple="false"
          color="modanisa-orange"
          :value="installmentOption.installmentNumber"
          class="installment-change-selector t-px-4 t-py-2.5 mb-0 t-text-sm"
          :class="{
            't-bg-table-zebra-dark':
              installmentOption.installmentNumber % 2 === 0,
          }"
        >
          <template #label>
            <div class="t-grid t-grid-cols-12 t-col-span-12 t-w-full">
              <div class="t-col-span-4 t-text-start t-text-black t-text-sm">
                <div v-if="installmentOption.installmentNumber === 1">
                  {{ $t('singlePayment') }}
                </div>
                <div v-else>
                  {{ installmentOption.installmentNumber }}
                  {{ $t('installment') }}
                </div>
              </div>
              <div
                class="t-col-span-4 t-pe-6 t-text-center t-text-black t-text-sm"
              >
                <div v-if="installmentOption.installmentNumber === 1">-</div>
                <div v-if="installmentOption.installmentNumber !== 1">
                  {{ installmentOption.monthly }}
                  {{ currency }}
                </div>
              </div>
              <div class="t-col-span-4 t-text-end t-text-black t-text-sm">
                {{ installmentOption.total }}
                {{ currency }}
              </div>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import VueI18n from 'vue-i18n'
import { InstallmentOption } from '@/types/types'

Vue.use(VueI18n)

@Component({
  components: {},
})
export default class InstallmentOptions extends Vue {
  selectedInstallment = 1
  get showInstallmentOptions(): boolean {
    return this.$store.getters.binInstallmentOptions?.installments?.length > 0
  }

  get installmentOptions(): Array<any> {
    return this.$store.getters.binInstallmentOptions
  }

  get currency(): string {
    return this.$store.getters.paymentDetails.currency
  }

  get installmentOptionsForSelectBox(): Array<any> {
    const installmentOptions: Array<any> = []
    if (undefined !== this.$store.getters.binInstallmentOptions.installments) {
      this.$store.getters.binInstallmentOptions.installments.forEach(
        (element: InstallmentOption) => {
          let name = this.$t('singlePayment')
          if (element.installmentNumber !== 1) {
            name = `${element.installmentNumber} ${this.$t('installment')} - (${
              element.installmentNumber
            } x ${element.monthly} ${
              this.$store.getters.paymentDetails.currency
            })`
          }
          installmentOptions.push({
            name,
            value: element.installmentNumber,
          })
        }
      )
    } else {
      installmentOptions.push({
        name: this.$t('singlePayment'),
        value: 1,
      })
      this.selectedInstallment = 1
    }
    return installmentOptions
  }

  @Watch('selectedInstallment')
  onSelectedInstallmentChanged(val: number, oldVal: number): void {
    if (val !== oldVal) {
      this.$store.dispatch('selectedInstallmentChanged', val)
    }
  }
}
</script>

<style scoped>
.installment-change-selector >>> .v-input--selection-controls__ripple {
  left: -13px;
}
.installment-change-selector >>> .v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
}
.installment-change-selector >>> .v-icon.v-icon {
  font-size: 20px !important;
  color: #d2d2d2;
}
</style>
