/* eslint-disable no-redeclare */ /* eslint-disable no-undef */
<template>
  <div :id="`${method}`"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// eslint-disable-next-line no-redeclare
// eslint-disable-next-line no-var
declare var Klarna: any

// eslint-disable-next-line no-redeclare
// eslint-disable-next-line no-var
declare var Print: any
@Component
export default class KlarnaForm extends Vue {
  @Prop({ required: true }) method!: string
  @Prop({ required: true }) clientToken!: string
  @Prop({ required: true }) params!: string

  created() {
    const globalAny: any = global
    globalAny.window.klarnaAsyncCallback = () => {
      // eslint-disable-next-line no-undef
      if (Klarna !== undefined) {
        this.initKlarna()
      }
    }
  }

  initKlarna() {
    // eslint-disable-next-line no-undef
    Klarna.Payments.init({
      client_token: this.clientToken,
    })
    // eslint-disable-next-line no-undef
    Klarna.Payments.load(
      {
        container: `#${this.method}`,
        payment_method_category: `${this.method}`,
      },
      () => {
        this.authorizeKlarna()
      }
    )
  }

  head(): any {
    return {
      script: [
        {
          hid: 'klarna',
          src: 'https://x.klarnacdn.net/kp/lib/v1/api.js',
          defer: true,
        },
      ],
    }
  }

  authorizeKlarna(): void {
    // eslint-disable-next-line no-undef
    Klarna.Payments.authorize(
      {
        payment_method_category: `${this.method}`,
      },
      JSON.parse(atob(this.params)),
      (response: any) => {
        if (response.approved && response.authorization_token) {
          Print.postMessage(response.authorization_token)
        }
        if (
          !response.authorization_token &&
          sessionStorage.getItem('authToken') === null &&
          sessionStorage.getItem('authToken') !== undefined
        ) {
          sessionStorage.setItem('authToken', response.authorization_token)
          this.authorizeKlarna()
        }
      }
    )
  }
}
</script>
