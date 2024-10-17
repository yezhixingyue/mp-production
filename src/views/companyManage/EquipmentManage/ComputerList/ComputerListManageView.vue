<template>
  <section class="mp-equipment-manage-computer-manage-wrap">
    <Header @add="onDialogSaveClick(null)" :localManageListData='localManageListData' @getList="getList" />
    <main>
      <Dialog v-model:visible="visible" :item="row" :isCopy="isCopy" @submit="onDialogSubmitClick" />
      <RemarkDialog v-model:visible="remarkVisible" :row="row" :operationType="operationType"  @submit="onRemarkDialogSubmit" />
      <HistoryDialog v-model:visible="history.visible" :item="history.row" />
      <Table :list="localManageListData.list" :loading="localManageListData.loading"
        :operationType='operationType'
        @edit="onDialogSaveClick"
        @history="onHistoryClick"
        @abandon="onRemarkDialogOpen"
        @callin="onRemarkDialogOpen"
        @callout="onRemarkDialogOpen"
       />
    </main>

    <Footer :Page="localManageListData.condition.Page" :PageSize="localManageListData.condition.PageSize" :listNumber="localManageListData.listNumber"
     @getList="getList" @excel="getExcelDownload" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Header from './components/Header.vue';
import Dialog from './components/Dialog.vue';
import Table from './components/Table.vue';
import Footer from './components/Footer.vue';
import RemarkDialog from './components/RemarkDialog.vue';
import HistoryDialog from './components/HistoryDialog.vue';
import { ComputerListManageClass } from './model/ComputerListManageClass';
import { useSaveDialog } from './hooks/useSaveDialog';
import { useHistory } from './hooks/useHistory';
import { useStaffList } from './hooks/useStaffList';

const localManageListData = ref(new ComputerListManageClass());

const {
  visible, row, isCopy, remarkVisible, operationType, onDialogSaveClick, onDialogSubmitClick, onRemarkDialogOpen, onRemarkDialogSubmit,
} = useSaveDialog(localManageListData);

const { history, onHistoryClick } = useHistory();

const { staffList, departmentList } = useStaffList();

const getList = (Page = 1) => localManageListData.value.getList(Page, staffList.value);

const getExcelDownload = () => {
  localManageListData.value.excel(staffList.value, departmentList.value);
};

onMounted(getList);
</script>

<script lang='ts'>
export default {
  name: 'ComputerListManageView',
};
</script>

<style scoped lang='scss'>
.mp-equipment-manage-computer-manage-wrap {
  width: 100%;
  height: 100%;
  padding-left: 8px;
  box-sizing: border-box;
  background-color: #f6f6f6;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;

  > header, > main, > footer {
    background-color: #fff;
  }

  > main {
    overflow: hidden;
  }

  :deep(.el-dialog__body) {
    padding-top: 25px;
  }
}
</style>
