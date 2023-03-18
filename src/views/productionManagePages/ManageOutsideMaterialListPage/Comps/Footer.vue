<template>
  <footer>
    <MpPagination center :nowPage="condition.Page" :pageSize="condition.PageSize" :total="total"
     :handlePageChange="getList" :ExportExcelProps="downloadExcelObj" />
  </footer>
</template>

<script setup lang='ts'>
import { IExportExcelCondition, IExportExcelProps } from '@/components/common/General/DownLoadExcelComp/types';
import MpPagination from '@/components/common/MpPagination.vue';
import { computed, ComputedRef } from 'vue';
import { Condition } from '../js/Condition';

const props = defineProps<{
  getList:(Page?: number) => void
  condition: Condition
  total: number
}>();

const downloadExcelObj: ComputedRef<IExportExcelProps> = computed(() => {
  const condition = props.condition.filter() as IExportExcelCondition;
  const fileDate = {
    First: (condition.CreateTime as Condition['CreateTime']).First,
    Second: (condition.CreateTime as Condition['CreateTime']).Second,
  };

  return {
    apiPath: 'getExternalMaterialExcel',
    fileName: '外来物料列表',
    condition,
    fileDate,
    // withExportDate: true,
  };
});

</script>

<style scoped lang='scss'>
</style>
