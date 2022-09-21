<template>
  <header>
    <mp-button type="primary" @click="onClick">+添加设备组</mp-button>
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
