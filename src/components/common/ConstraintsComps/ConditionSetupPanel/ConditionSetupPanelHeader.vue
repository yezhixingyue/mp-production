<template>
  <header>
    <span class="is-blue-span" @click="onClick">+添加条件</span>
  </header>
</template>

<script setup lang='ts'>
const emit = defineEmits(['click']);

const onClick = () => {
  emit('click');
};

</script>

<style scoped lang='scss'>
</style>
