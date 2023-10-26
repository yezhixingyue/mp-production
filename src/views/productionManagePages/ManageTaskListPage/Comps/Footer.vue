<template>
  <footer>
    <MpPagination center :nowPage="condition.Page" :pageSize="condition.PageSize" :total="total"
     :handlePageChange="getList" :ExportExcelProps="downloadExcelObj" />
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { useUserStore } from '@/store/modules/user';
import { IExportExcelProps, IExportExcelCondition } from '@/components/common/General/DownLoadExcelComp/types';
import { ComputedRef, computed } from 'vue';
import { Condition } from '../js/Condition';

const props = defineProps<{
  getList:(Page?: number) => void
  condition: Condition
  total: number
}>();

const userStore = useUserStore();
const localPermission = computed(() => userStore.user?.PermissionList.PermissionManageTask.Obj);

const downloadExcelObj: ComputedRef<IExportExcelProps | undefined> = computed(() => { // 导出Excel
  if (!localPermission.value?.Excel) return undefined;
  const condition = props.condition.filter() as IExportExcelCondition;
  const fileDate = {
    First: (condition.FinishTime as Condition['FinishTime']).First,
    Second: (condition.FinishTime as Condition['FinishTime']).Second,
  };

  return {
    apiPath: 'getTaskExcel',
    fileName: '外协任务列表',
    condition,
    fileDate,
  };
});
</script>

<style scoped lang='scss'>
</style>
