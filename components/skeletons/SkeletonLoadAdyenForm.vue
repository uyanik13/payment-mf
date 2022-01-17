<template>
  <div class="overlay t-grid t-gap-4 t-grid-cols-12">
    <div
      class="card-number-field loading t-col-span-12 xl:t-col-start-1 xl:t-col-end-9"
    />
    <div
      class="month-year-field loading t-col-span-6 xl:t-col-start-1 xl:t-col-end-5"
    />
    <div
      class="cvv-field loading t-col-span-6 xl:t-col-start-5 xl:t-col-end-9"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class SkeletonLoadPaymentOptions extends Vue {}
</script>

<style>
.card-number-field {
  height: 44px;
  flex-grow: 0;
  border-radius: 10px;
  background-color: #eaeaea;
}

.month-year-field {
  height: 44px;
  flex-grow: 0;
  border-radius: 10px;
  background-color: #eaeaea;
}

.cvv-field {
  height: 44px;
  flex-grow: 0;
  border-radius: 10px;
  background-color: #eaeaea;
}

.overlay {
  position: absolute;
  width: 88%;
  z-index: 2;
  background-color: white;
}
</style>
