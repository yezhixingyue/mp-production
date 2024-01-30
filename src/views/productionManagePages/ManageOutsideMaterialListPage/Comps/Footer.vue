<template>
  <footer>
    <MpPagination center :nowPage="condition.Page" :pageSize="condition.PageSize" :total="total"
     :handlePageChange="getList" :ExportExcelProps="downloadExcelObj" />
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { useUserStore } from '@/store/modules/user';
import { IExportExcelProps } from '@/components/common/General/DownLoadExcelComp/types';
import { computed } from 'vue';
import { Condition } from '../js/Condition';

const props = defineProps<{
  getList:(Page?: number) => void
  condition: Condition
  total: number
}>();

const userStore = useUserStore();
const localPermission = computed(() => userStore.user?.PermissionList.PermissionExternalMaterial.Obj);

const downloadExcelObj: undefined | IExportExcelProps = localPermission.value?.Excel ? {
  apiPath: 'getExternalMaterialExcel',
  fileName: '外来物料列表',
  getCondition: () => props.condition.filter(),
  getFileNameDate: () => ({
    First: props.condition.CreateTime.First,
    Second: props.condition.CreateTime.Second,
  }),
} : undefined;

</script>

<style scoped lang='scss'>
</style>
