<template>
  <footer>
    <MpPagination center :nowPage="condition.Page" :pageSize="condition.PageSize"
     :total="total" :handlePageChange="getList"  />
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { Condition } from '../js/Condition';

defineProps<{
  getList:(Page?: number) => void
  condition: Condition
  total: number
}>();
</script>

<style scoped lang='scss'>
</style>
