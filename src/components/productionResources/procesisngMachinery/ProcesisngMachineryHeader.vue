<template>
  <header>
    <mp-button type="primary" @click="onClick">+添加加工设备</mp-button>
  </header>
</template>

<script setup lang='ts'>
import MpButton from '@/components/common/MpButton.vue';

const emit = defineEmits(['add']);

const onClick = () => {
  emit('add', null);
};

</script>

<style scoped lang='scss'>
</style>
