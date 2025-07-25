<template>
  <footer>
    <MpPagination center :nowPage="condition.Page" :pageSize="condition.PageSize" :total="total" :handlePageChange="getList"
     :ExportExcelProps="downloadExcelObj" />
  </footer>
</template>

<script setup lang='ts'>
import { IExportExcelProps } from '@/components/common/General/DownLoadExcelComp/types';
import MpPagination from '@/components/common/MpPagination.vue';
import { ConditionForList } from '../../js/ConditionForList';

const props = defineProps<{
  getList:(Page?: number) => void
  condition: ConditionForList
  total: number
}>();

const downloadExcelObj: IExportExcelProps = {
  apiPath: 'getProductionExceptionExcel',
  fileName: `${props.condition.IsOutSourcing ? '外协' : '生产'}异常列表`,
  getCondition: () => props.condition.filter(),
  maxCountLimit: 15000,
  getTotal: () => props.total,
  getFileNameDate: () => ({
    First: props.condition.CreateTime.First,
    Second: props.condition.CreateTime.Second,
  }),
};

</script>

<style scoped lang='scss'>
</style>
