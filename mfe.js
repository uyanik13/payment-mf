import Vue from 'vue'

export default function (render) {
  if (!window.__POWERED_BY_QIANKUN__) {
    render()
  }
}

export function bootstrap() {}

export async function mount(render, props) {
  await render()
}

export async function update() {}

export function mounted(instance, props) {
  if (props.name) {
    instance.$store.commit('updateAppName', props.name)
  }
  if (props.mfReady) {
    Vue.prototype.$mfReady = props.mfReady
  }
  if (props.sdk) {
    Vue.prototype.$sdk = props.sdk
    props.onGlobalStateChange((state) => {
      instance.$store.commit('updateAppParams', {
        customerId: state.checkout.customerId,
        language: state.checkoutParams.language,
        shippingCountryCode: state.checkoutParams.shippingCountryCode,
        checkoutId: state.checkout.id,
        selectedPaymentOption: state.selectedPaymentOption,
      })
      instance.$store.dispatch('updatePaymentDetails', {
        price: state.checkout.paymentSummary.totalPrice,
        currency: state.currency,
        orders: state.checkout.orders,
      })
      instance.$store.commit('updateAuthToken', state.token)
    }, true)
  }
}
export function beforeUnmount(instance) {}
export function unmount() {}
