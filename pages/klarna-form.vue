<template>
  <div>
    <KlarnaAppForm
      :method="$route.query.method"
      :client-token="$route.query.client_token"
      :params="$route.query.params"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import KlarnaAppForm from '~/components/KlarnaAppForm.vue'
@Component({
  components: {
    KlarnaAppForm,
  },
})
export default class KlarnaFormPage extends Vue {}
</script>
