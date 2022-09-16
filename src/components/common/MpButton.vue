<template>
  <el-button v-bind="$attrs">
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: 'MpButton',
  setup() {
    // console.log(this.$attrs);
  },
};
</script>
<style scoped lang="scss">
</style>
