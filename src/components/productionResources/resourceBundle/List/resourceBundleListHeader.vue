<template>
  <header>
    <mp-button type="primary" @click="onClick">+添加物料资源包</mp-button>
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
// deep
</style>
