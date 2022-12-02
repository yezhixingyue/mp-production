<template>
  <header>
    <Steps :step="step" :stepList="stepList" />
  </header>
</template>

<script setup lang='ts'>
import { PlaceStepEnum } from '../js/enums';
import Steps from './Steps.vue';

defineProps<{
  step: PlaceStepEnum
  stepList: { ID: PlaceStepEnum, Name: string }[]
}>();
</script>

<style scoped lang='scss'>
</style>
