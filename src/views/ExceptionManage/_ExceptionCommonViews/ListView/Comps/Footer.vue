<template>
  <footer>
    <MpPagination center :nowPage="condition.Page" :pageSize="condition.PageSize" :total="total" :handlePageChange="getList" />
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { ConditionForList } from '../../js/ConditionForList';

defineProps<{
  getList:(Page?: number) => void
  condition: ConditionForList
  total: number
}>();

</script>

<style scoped lang='scss'>
</style>
