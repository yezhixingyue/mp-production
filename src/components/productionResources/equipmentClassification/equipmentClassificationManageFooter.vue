<template>
  <footer>
    <MpPagination countInLeft :total="props.total" />
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';

const props = defineProps<{
  total: number,
}>();
</script>

<style scoped lang='scss'>
</style>
