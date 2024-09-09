<template>
  <footer>
    <MpPagination center :nowPage="condition.Page" :pageSize="condition.PageSize" :total="total"
     :handlePageChange="getList" :ExportExcelProps="downloadExcelObj" />
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { IExportExcelProps } from '@/components/common/General/DownLoadExcelComp/types';
import { useUserStore } from '@/store/modules/user';
import { computed } from 'vue';
import { Condition } from '../js/Condition';
import { PlateTypeEnum } from '../js/enum';

const props = defineProps<{
  getList:(Page?: number) => void
  condition: Condition
  total: number
}>();

const userStore = useUserStore();
const localPermission = computed(() => userStore.user?.PermissionList.PermissionManagePlate.Obj);

const downloadExcelObj: undefined | IExportExcelProps = localPermission.value?.Excel ? {
  apiPath: 'getPlateExcel',
  fileName: `${props.condition.Type === PlateTypeEnum.Plate ? '大版' : '后工版'}列表`,
  getCondition: () => props.condition.filter(),
  getFileNameDate: () => ({
    First: props.condition.CreateTime.First,
    Second: props.condition.CreateTime.Second,
  }),
} : undefined;
</script>

<style scoped lang='scss'>
</style>
