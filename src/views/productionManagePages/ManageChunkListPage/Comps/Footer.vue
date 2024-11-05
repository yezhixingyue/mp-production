<template>
  <footer>
    <MpPagination center :nowPage="condition.Page" :pageSize="condition.PageSize"
     :total="total" :handlePageChange="getList" :ExportExcelProps="downloadExcelObj"  />
  </footer>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { useUserStore } from '@/store/modules/user';
import MpPagination from '@/components/common/MpPagination.vue';
import { IExportExcelProps } from '@/components/common/General/DownLoadExcelComp/types';
import { Condition } from '../js/Condition';

const props = defineProps<{
  getList:(Page?: number) => void
  condition: Condition
  total: number
}>();

const userStore = useUserStore();
const localPermission = computed(() => userStore.user?.PermissionList.PermissionManageChunk.Obj);

const downloadExcelObj: undefined | IExportExcelProps = localPermission.value?.Excel ? {
  apiPath: 'getChunkExcel',
  fileName: '块列表',
  getCondition: () => props.condition.filter(),
  getFileNameDate: () => ({
    First: props.condition.CreateTime.First,
    Second: props.condition.CreateTime.Second,
  }),
} : undefined;
</script>

<style scoped lang='scss'>
</style>
