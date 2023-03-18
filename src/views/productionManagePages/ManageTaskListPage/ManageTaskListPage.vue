<template>
  <section class="page-wrap">
    <Header :ManageTaskListData="ManageTaskListData" :getList="getList" />
    <TaskListTable :rowDisplayOptions="rowDisplayOptions" showHeader :TaskList="ManageTaskListData.TaskList" :loading="ManageTaskListData.loading" />
    <Footer :condition="ManageTaskListData.condition" :getList="getList" :total="ManageTaskListData.TaskListNumber" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import TaskListTable from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/TaskListTable.vue';
import api from '@/api';
import { ManageTaskListClass } from './js/ManageTaskListClass';
import Header from './Comps/Header.vue';
import Footer from './Comps/Footer.vue';

const ManageTaskListData = ref(new ManageTaskListClass());

const rowDisplayOptions = {
  showContent: true,
  showWishDuration: true,
  showActualDuration: true,
  showStatus: false,
  showFinishTime: true,
  showEquAndOperator: true,
};

const getList = async (Page = 1) => {
  ManageTaskListData.value.TaskList = [];
  ManageTaskListData.value.loading = true;

  ManageTaskListData.value.condition.Page = Page;

  const temp = ManageTaskListData.value.condition.filter();
  const resp = await api.productionManageApis.getEquipmentTaskList(temp).catch(() => null);

  ManageTaskListData.value.loading = false;

  if (resp?.data.isSuccess) {
    ManageTaskListData.value.TaskList = resp.data.Data;
    ManageTaskListData.value.TaskListNumber = resp.data.DataNumber;
  }
};

onMounted(async () => {
  getList();
  ManageTaskListData.value.EquipmentFilterData.getInitData();
});
</script>

<script lang="ts">
export default {
  name: 'ManageTaskListPage',
};
</script>

<style scoped lang='scss'>
.page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  > main {
    flex: 1;
    margin-top: 8px;
    overflow: hidden;
    > :deep(.el-table) {
      height: 100%;
      margin-top: 0;
    }
  }
  > footer {
    height: 40px;
    padding-top: 7px;
  }
  > header, > footer {
    flex: none;
  }
  > header, > main, > footer {
    background-color: #fff;
  }
}
</style>
