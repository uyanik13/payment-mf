<template>
  <label :class="fieldStyleClass">
    <div class="card-field-with-label">
      <div
        class="card-field-label-div ms-4 t-ps-1 t-pe-1"
        :class="{
          'hide-value': !(
            fieldValid ||
            isFocussed ||
            (fieldError && fieldError !== '')
          ),
          'show-value':
            fieldValid || isFocussed || (fieldError && fieldError !== ''),
        }"
      >
        <span
          class="card-field-label t-text-start"
          :class="{
            'add-focus .add-fade-in': isFocussed,
            'remove-focus': !isFocussed,
            'mark-error': toggleFieldError,
          }"
          >{{ fieldLabel }}</span
        >
      </div>
      <div
        class="card-field ps-4"
        :class="{
          'add-focus': isFocussed,
          'remove-focus': !isFocussed,
          'mark-error': toggleFieldError,
          'add-border-color': fieldReady,
        }"
      >
        <span
          class="transition-place-holder"
          :class="{
            'add-transition': isFocussed,
            'hide-value': fieldValid || (fieldError && fieldError !== ''),
            'mark-error': toggleFieldError,
          }"
          >{{ fieldLabel }}</span
        >
        <span class="card-field-input" :data-cse="fieldType"></span>
      </div>
    </div>
    <div v-if="toggleFieldError">
      <span
        class="error-text t-text-start"
        :class="{
          'mark-error': toggleFieldError,
        }"
        >{{ fieldErrorText }}</span
      >
    </div>
  </label>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class AdyenField extends Vue {
  @Prop({ required: true }) fieldStyleClass!: string
  @Prop({ required: true }) fieldLabel!: string
  @Prop({ required: true }) fieldType!: string
  @Prop({ required: true }) invalidErrorText!: string
  errorBelongsToCurrentField = false

  get isFocussed(): boolean {
    const fieldName = this.$store.getters['card/getSelectedFieldName']
    if (fieldName === this.fieldType) {
      this.errorBelongsToCurrentField = true
      return true
    } else if (!this.errorBelongsToCurrentField) {
      this.errorBelongsToCurrentField = false
    }
    return false
  }

  get toggleFieldError(): boolean {
    return (
      this.shouldShowErrorOnFocusOut() ||
      this.shouldShowErrorForNonInteraction()
    )
  }

  shouldShowErrorOnFocusOut(): boolean {
    return (
      !this.$store.getters['card/getFieldValidity'](this.fieldType) &&
      this.errorBelongsToCurrentField &&
      this.$store.getters['card/getSelectedFieldName'] !== this.fieldType
    )
  }

  shouldShowErrorForNonInteraction(): boolean {
    return (
      this.$store.getters['card/shouldShowNotInteractedFieldError'] &&
      this.$store.getters['card/getNotInteractedFields'][this.fieldType]
    )
  }

  get fieldErrorText(): string {
    if (!this.$store.getters['card/getFieldValidity'](this.fieldType)) {
      if (
        !this.$store.getters['card/getFieldError'](this.fieldType) ||
        this.$store.getters['card/getFieldError'](this.fieldType) === ''
      ) {
        return this.$t('thisFieldIsRequired').toString()
      }
      return this.invalidErrorText
    }
    return 'This field has unknown error'
  }

  get fieldError(): string {
    return this.$store.getters['card/getFieldError'](this.fieldType)
  }

  get fieldValid(): boolean {
    return this.$store.getters['card/getFieldValidity'](this.fieldType)
  }

  get fieldReady(): boolean {
    return this.$store.getters['card/getIframesLoadStatus']
  }
}
</script>
<style scoped>
.add-border-color {
  border-color: #d2d2d2 !important;
}
.card-field-with-label {
  height: 44px;
}
.card-field {
  height: 44px;
  position: relative;
  border-color: white;
  border-width: 2px;
  border-radius: 5px;
  padding: 1px;
}
.card-field-focussed {
  border-color: black;
}
.card-field-label-div {
  font-size: 12px;
  z-index: 1;
  position: absolute;
  margin-top: -6px;
  background: white;
  align-content: center;
  height: 12px;
}
.card-field-label {
  display: block;
  margin-top: -1px;
  font-family: HankenSans;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #999999;
}

.remove-focus {
  color: #999999;
}
.add-focus {
  color: black;
  border-color: black !important;
}
@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.add-fade-in {
  /* -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
  transition: fadeIn 0.3s; */
  visibility: visible;
  opacity: 1;
  transition: opacity 0.5s linear;
}
.add-transition {
  transform: translateY(-18px) scale(0.75);
  -webkit-transition: transform 1.05s ease-in-out;
  -moz-transition: transform 1.05s ease-in-out;
  -ms-transition: transform 1.05s ease-in-out;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 1s, opacity 0.3s linear, transform 0.3s ease-in-out;
}
.transition-place-holder {
  position: absolute;
  background-color: white;
  z-index: 1;
  pointer-events: none;
  margin-top: 6px;
}
.card-field-input {
  height: 44px;
  position: relative;
  top: 0;
  left: 0;
}
.show-value {
  visibility: visible;
}
.hide-value {
  visibility: hidden;
}
.mark-error {
  color: #f61a55 !important;
  border-color: #f61a55 !important;
}
.error-text {
  height: 15px;
  font-family: HankenSans;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  color: #f61a55;
}
</style>
