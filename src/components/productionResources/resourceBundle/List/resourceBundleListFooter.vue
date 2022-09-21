<template>
  <footer>
    <MpPagination center :nowPage="props.condition.Page" :pageSize="props.condition.PageSize" :total="total" :handlePageChange="props.getList" />
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { ResourceBundleListCondition } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundleListCondition';

const props = defineProps<{
  condition: ResourceBundleListCondition,
  total: number,
  getList:(Page: number) => void,
}>();
</script>

<style scoped lang='scss'>
</style>
