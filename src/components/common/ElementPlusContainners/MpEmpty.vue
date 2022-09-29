<template>
  <el-empty :description="props.description" class="mp-common-empty-comp-wrap" />
</template>

<script setup lang='ts'>
const props = withDefaults(defineProps<{
  description?: string,
}>(), {
  description: '暂无数据',
});
</script>

<style scoped lang='scss'>
.mp-common-empty-comp-wrap {
  :deep(.el-empty__description) p {
    font-size: 13px;
    color: #989898;
  }
}
</style>
