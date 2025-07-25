<template>
  <section class="page-wrap">
    <header>
      <MpBreadcrumb :list="breadcrumbList" />
      <div class="info">
        <h4>{{ EquCombineTitle }} 任务列表</h4>
        <p>
          <span>操作工：{{ EquTaskDetailData.rowData?.Operator || '暂无人员登录' }}</span>
          <span class="ml-30" v-if="EquTaskDetailData.rowData?.LoginTime">{{ format2MiddleLangTypeDateFunc2(EquTaskDetailData.rowData.LoginTime) }}</span>
        </p>
      </div>
    </header>
    <TaskListTable
      showHeader
      :TaskList="EquTaskDetailData.TaskList"
      :loading="EquTaskDetailData.loading"
      :rowDisplayOptions="{
        showContent: true,
        showWishDuration: true,
        showLatestFinishTime: true,
        showCtrlMenus: ['switchEqu'],
      }"
      @switchEqu="onSwitchEquClick"
    />
    <SwitchEquipmentDialog v-model:visible="visible" :curTaskItem="curTaskItem" @submit="switchEquSubmit" />
    <footer>
      <MpPagination center :nowPage="EquTaskDetailData.condition.Page" :pageSize="EquTaskDetailData.condition.PageSize" :ExportExcelProps="downloadExcelObj"
       :total="EquTaskDetailData.TaskListNumber" :handlePageChange="EquTaskDetailData.getTaskList.bind(EquTaskDetailData)">
       <template #text>
          <span v-show="EquTaskDetailData.TotalMessage" class="mr-25"
            >预计加工总时长：<i class="is-pink bold">{{ transformMinute(EquTaskDetailData.TotalMessage) }}</i></span>
          <span>共检索出</span>
          <i class="num"> {{EquTaskDetailData.TaskListNumber}} </i>
          <span>条记录</span>
        </template>
      </MpPagination>
      <div class="btn-row">
        <mp-button class="blue return-btn" @click="getGoBackFun">返回</mp-button>
      </div>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { getGoBackFun } from '@/router';
import {
  computed, onMounted, onUnmounted, ref,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import TaskListTable from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/TaskListTable.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import { useUserStore } from '@/store/modules/user';
import { IExportExcelProps } from '@/components/common/General/DownLoadExcelComp/types';
import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { transformMinute } from '@/assets/js/utils/ConvertTimeFormat';
import { EquipmentTaskDetailClass } from './js/EquipmentStatusDetailClass';
import SwitchEquipmentDialog from './Comp/SwitchEquipmentDialog.vue';

const row = sessionStorage.getItem('EquipmentStatusDetailData');

const EquTaskDetailData = ref(new EquipmentTaskDetailClass(row ? JSON.parse(row) : null));

/** 由分类、设备组、设备名称组成的设备组合名称 */
const EquCombineTitle = computed(() => {
  if (!EquTaskDetailData.value.rowData) return '';

  const { ClassName, GroupName, Name } = EquTaskDetailData.value.rowData.Equipment;
  return [ClassName, GroupName, Name].join(' ');
});

const breadcrumbList = [
  { to: { path: '/EquipmentStatus' }, name: '设备状态' },
  {
    name: EquCombineTitle.value,
  },
];

const visible = ref(false);
const curTaskItem = ref<null | ReturnType<typeof getLocalTaskList>[number]>(null);
const onSwitchEquClick = (e: ReturnType<typeof getLocalTaskList>[number]) => {
  curTaskItem.value = e;
  visible.value = true;
};

const switchEquSubmit = (EquipmentID: string) => {
  const TaskWorkingID = curTaskItem.value?.Working.TaskWorkingID;
  if (!TaskWorkingID || !EquipmentID) return;

  const cb = () => {
    visible.value = false;
    sessionStorage.setItem('refreshEquipmentStatusList', 'True');
  };

  EquTaskDetailData.value.switchEquSubmit(TaskWorkingID, EquipmentID, cb);
};

const userStore = useUserStore();
const localPermission = computed(() => userStore.user?.PermissionList.PermissionEquipmentStatus.Obj);
const downloadExcelObj: undefined | IExportExcelProps = localPermission.value?.Excel ? {
  apiPath: 'getTaskExcel',
  fileName: `${EquCombineTitle.value}任务列表`,
  getCondition: () => ({ ...EquTaskDetailData.value.condition.filter(), UseModule: 1 }),
  maxCountLimit: 15000,
  getTotal: () => EquTaskDetailData.value.TaskListNumber,
  // getFileNameDate: () => ({
  //   First: props.condition.CreateTime.First,
  //   Second: props.condition.CreateTime.Second,
  // }),
  withExportDate: true,
} : undefined;

onMounted(() => {
  if (!row) {
    getGoBackFun();
  } else {
    sessionStorage.removeItem('refreshEquipmentStatusList');
    EquTaskDetailData.value.getTaskList();
  }
});

onUnmounted(() => {
  sessionStorage.removeItem('EquipmentStatusDetailData');
});

</script>

<script lang="ts">
export default {
  name: 'EquipmentStatusDetailPage',
};
</script>

<style scoped lang='scss'>
.page-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #fff;

  > header {
    height: 95px;
    box-sizing: border-box;
    padding: 20px 20px 0;

    .info {
      text-align: center;
      h4 {
        font-size: 16px;
        margin-top: 6px;
        margin-bottom: 2px;
      }
    }
  }

  > main {
    flex: 1;
    overflow: hidden;

    > :deep(.el-table) {
      height: 100%;
      margin-top: 0;
    }
  }

  > footer {
    padding-top: 6px;

    .btn-row {
      text-align: center;
      padding: 15px;
      padding-bottom: 30px;
      .return-btn {
        width: 120px;
        height: 34px;
      }
    }
  }

  > header, > footer {
    flex: none,
  }
}
</style>
