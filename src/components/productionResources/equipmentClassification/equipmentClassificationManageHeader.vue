<template>
  <header>
    <el-button type="primary" @click="onClick">+添加设备分类</el-button>
  </header>
</template>

<script setup lang='ts'>
const emit = defineEmits(['add']);

const onClick = () => {
  emit('add', null);
};

</script>

<style scoped lang='scss'>
// deep
</style>
