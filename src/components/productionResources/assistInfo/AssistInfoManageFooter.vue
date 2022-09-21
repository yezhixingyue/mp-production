<template>
  <footer>
    <MpPagination countInLeft center :nowPage="props.condition.Page" :pageSize="props.condition.PageSize" :total="total" :handlePageChange="props.getList" />
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { AssistListConditionClass } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';

const props = defineProps<{
  condition: AssistListConditionClass,
  total: number,
  getList:(Page: number) => void,
}>();
</script>

<style scoped lang='scss'>
</style>
