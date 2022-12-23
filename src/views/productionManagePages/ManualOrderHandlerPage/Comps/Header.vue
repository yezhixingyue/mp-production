<template>
  <header>
    <MpSteps :step="step" :stepList="stepList" />
  </header>
</template>

<script setup lang='ts'>
import MpSteps from '@/components/common/General/MpSteps.vue';
import { PlaceStepEnum } from '../js/enums';

defineProps<{
  step: PlaceStepEnum
  stepList: { ID: PlaceStepEnum, Name: string }[]
}>();
</script>

<style scoped lang='scss'>
</style>
