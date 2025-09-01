<template>
  <section class="mp-prod-condition-prop-select-dialogwrap">
    <Header :ManageTaskListData="ManageTaskListData" :EquipmentFilterData="EquipmentFilterData" :LineList="LineList" />

    <main>
      <Table :list="ManageTaskListData.list" :IsPlateTask="currentTab" :loading="ManageTaskListData.loading" />
    </main>

    <footer>
      <MpPagination center :nowPage="ManageTaskListData.condition.Page" :pageSize="ManageTaskListData.condition.PageSize" :total="ManageTaskListData.listNumber"
        :ExportExcelProps="downloadExcelObj" :handlePageChange="(page) => ManageTaskListData.getList(page)" />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import MpPagination from '@/components/common/MpPagination.vue';
import { EquipmentFilterClass } from '@/assets/js/Class/EquipmentFilterClass';
import { ManageDigitalCompletionTaskList } from './js/ManageDigitalCompletionTaskList';
import Header from './components/Header.vue';
import Table from './components/Table.vue';
import { ManagePageData } from './js/ManagePageData';

const props = defineProps<{
  ManageTaskListData: ManageDigitalCompletionTaskList
  EquipmentFilterData: Required<EquipmentFilterClass>
  Permission: ManagePageData['Permission']
  currentTab: ManagePageData['currentTab']
  LineList: ManagePageData['LineList']
}>();

const downloadExcelObj = computed(() => { // Excel导出参数
  let allowExcel = false;

  if (props.ManageTaskListData.IsPlateTask && props.Permission.Obj.PlateExcel) { // 版工序列表导出Excel
    allowExcel = true;
  }

  if (!props.ManageTaskListData.IsPlateTask && props.Permission.Obj.OrderExcel) { // 订单工序列表导出Excel
    allowExcel = true;
  }

  return !allowExcel ? undefined : {
    apiPath: 'getDigitalTaskExcel',
    fileName: () => (props.ManageTaskListData.IsPlateTask ? '版工序数码完工任务' : '订单工序数码完工任务'),
    getCondition: () => props.ManageTaskListData.condition.filter(),
    getFileNameDate: () => ({
      First: props.ManageTaskListData.condition.FinishTime.First,
      Second: props.ManageTaskListData.condition.FinishTime.Second,
    }),
  };
});

</script>

<style scoped lang='scss'>
.mp-prod-condition-prop-select-dialogwrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  > header {
    flex: none;
  }
  > main {
    flex: 1;
    overflow: hidden;
    padding: 0 8px;
    padding-left: 20px;
  }
  > footer {
    flex: none;
    padding: 8px;
  }
}
</style>
