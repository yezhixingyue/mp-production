<template>
  <div class="digital-list-print-list">
    <PrintItem v-for="it in list" :key="it.Code" :item="it" />
  </div>
</template>

<script setup lang='ts'>
import { ILocalDigitalOrderPlatePrintInfoWithQrCode } from '../../js/types';
import PrintItem from './PrintItem.vue';

defineProps<{
  list: ILocalDigitalOrderPlatePrintInfoWithQrCode[]
}>();
</script>

<style scoped lang='scss'>
</style>
