<template>
  <footer>
    <MpPagination center :nowPage="condition.Page" :pageSize="condition.PageSize" :total="total"
     :handlePageChange="getList" />
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { PDOCondition } from '../js/PDOCondition';

defineProps<{
  getList:(Page?: number) => void
  total: number
  condition: PDOCondition
}>();
</script>

<style scoped lang='scss'>
</style>
