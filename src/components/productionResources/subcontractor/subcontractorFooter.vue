<template>
  <footer>
    <MpPagination center :nowPage="props.condition.Page" :pageSize="props.condition.PageSize" :total="total" :handlePageChange="props.getList" />
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { SubcontractorListCondition } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorListCondition';

const props = defineProps<{
  condition: SubcontractorListCondition,
  total: number,
  getList:(Page: number) => void,
}>();
</script>

<style scoped lang='scss'>
</style>
