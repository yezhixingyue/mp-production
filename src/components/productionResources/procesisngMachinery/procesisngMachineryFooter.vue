<template>
  <footer>
    <MpPagination center :nowPage="props.condition.Page" :pageSize="props.condition.PageSize" :total="total" :handlePageChange="props.getList" />
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { EquipmentListCondition } from '@/views/productionResources/procesisngMachinery/TypeClass/EquipmentListCondition';

const props = defineProps<{
  condition: EquipmentListCondition,
  total: number,
  getList:(Page: number) => void,
}>();
</script>

<style scoped lang='scss'>
</style>
