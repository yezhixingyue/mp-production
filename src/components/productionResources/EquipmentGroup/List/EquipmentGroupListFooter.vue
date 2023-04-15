<template>
  <footer>
    <MpPagination style="width:100%"
     center
     :nowPage="EquipmentGroupData.condition.Page"
     :pageSize="EquipmentGroupData.condition.PageSize"
     :total="EquipmentGroupData.DataNumber"
     :handlePageChange="props.getList"
    />
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { EquipmentGroupTypeClass } from '@/store/modules/resource/EquipmentGroupTypeClass';

const props = defineProps<{
  EquipmentGroupData: Required<EquipmentGroupTypeClass>,
  getList:(Page: number) => void,
}>();
</script>

<style scoped lang='scss'>
</style>
