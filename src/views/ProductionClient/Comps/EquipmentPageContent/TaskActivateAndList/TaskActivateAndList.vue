<template>
  <section
    class="mp-client-task-activate-and-list-comp-wrap"
    v-if="curInstance && curInstance.loginData.token && curInstance.loginData.AssistantList && curInstance.Equipment.Status === EquipmentStatusEnum.normal"
    v-show="!curActiveInstance?.isCurTaskLoading">
    <!-- 1. 设置送达 -->
    <header>
      <h4>条码ID：</h4>
      <el-input v-model.trim="code" maxlength="20" ref="oInput" @keydown.enter="() => submit()">
        <template #append>
          <span class="btn" @click="() => submit()">送达</span>
        </template>
      </el-input>
    </header>

    <!-- 2. 普通列表展示 -->
    <TaskListTable :TaskList="curInstance.TaskListData.TaskList" :loading="curInstance.TaskListData.loading" useLittleHeight
      v-if="!curInstance.Equipment.AllowBatchReport" isClient
      v-show="curInstance.TaskListData.TaskList.length > 0" />
    <!-- 3. 批量上传列表展示与操作 -->
    <BatchReportComp
      v-else :curInstance="curInstance" v-show="curInstance.TaskListData.TaskList.length > 0"
      @singleReport="onSingleCompleteClick"
      @error="onErrorClick"
      @report="handleBatchReport"
    />

    <!-- 送达结果弹窗处理 -->
    <ResultHandleDialog :isBatchReport="!!curInstance.Equipment.AllowBatchReport"
     v-model:visible="resultVisible" :result="receiveResult" @close="onClose" @submit="onDialogSubmit" @confirm="onconfirm" />

    <!-- 组合工序资源列表查询弹窗 -->
    <DetailDialog v-model:visible="combineInfoVisible" :detail="combineInfoResult" @close="onClose" @completed="onReadyCompleted"
     isClientUse :EquipmentID="curInstance.Equipment.ID" />
  </section>
</template>

<script setup lang='ts'>
import { ManageClientPageData } from '@/api/client/clientStore';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { EquipmentReceiveCodeEnum } from '@/views/ProductionClient/assets/js/enum';
import { TerminalEquipmentInstance } from '@/views/ProductionClient/assets/js/Instance';
import { ITaskDetail, IReceiveResult } from '@/views/ProductionClient/assets/js/types';
import { EquipmentStatusEnum } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/enum';
import DetailDialog from '@/views/productionManagePages/CombineTaskPrintList/components/DetailDialog/DetailDialog.vue';
import { IUnionTaskDetail } from '@/views/productionManagePages/CombineTaskPrintList/types/type';
import {
  onMounted, ref, computed, onUnmounted, watch,
} from 'vue';
import ResultHandleDialog from './ResultHandleDialog.vue';
import TaskListTable from './TaskListTable.vue';
import BatchReportComp from './BatchReport/BatchReportComp.vue';

const props = defineProps<{
  curInstance: Required<TerminalEquipmentInstance>
}>();

const emit = defineEmits(['report', 'singleReport', 'error', 'displayPic']);

const curActiveInstance = computed(() => ManageClientPageData.value.curActiveInstance);

const code = ref('');

const oInput = ref<InstanceType<typeof HTMLInputElement>>();

const setInputFocus = () => { // 聚焦
  if (oInput.value) oInput.value?.focus();
};

const resultVisible = ref(false);
const receiveResult = ref<IReceiveResult | null>(null);
const combineInfoVisible = ref(false);
const combineInfoResult = ref<IUnionTaskDetail | null>(null);

const onClose = () => {
  receiveResult.value = null;
  combineInfoResult.value = null;
  code.value = '';
  setInputFocus();
};

const onReadyCompleted = (e:{ ID: string; ReadyOperator: string }) => { // 齐整完成
  const t = props.curInstance.TaskListData.TaskList.find(it => it.ID === e.ID);
  if (t) {
    t.ReadyOperator = e.ReadyOperator;
  }
};

const submit = async (e?: { OnlyCurrent: boolean }) => {
  if (!oInput.value) return;
  oInput.value.blur();

  if (!code.value) {
    MpMessage.error({
      title: '条码ID不能为空', msg: '请扫描条码或输入条码编号', onCancel: setInputFocus, onOk: setInputFocus,
    });
    return;
  }

  const temp: { Code: string; OnlyCurrent?: boolean; } = {
    Code: code.value,
  };

  if (e) {
    temp.OnlyCurrent = e.OnlyCurrent;
  }

  combineInfoResult.value = null;

  const result = await props.curInstance.getEquipmentReceive(temp, setInputFocus);
  if (result) {
    // 1. 处理结果 多种可能
    if (result.QueryWorkCode === false) {
      receiveResult.value = result.Data;
      resultVisible.value = true;
    } else {
      // ============================================ 区分已终止和有结果 -- 根据状态码自动提示
      combineInfoResult.value = result.Data;
      combineInfoVisible.value = true;
    }
    // 2. 根据结果 在弹窗回调中执行 this.TaskListData.getEquipmentTaskList(); --- 在弹窗中回调处理
  } else {
    oInput.value.focus();
  }
};

const onDialogSubmit = (Code: number) => {
  if ([EquipmentReceiveCodeEnum.OK].includes(Code)) {
    // 仅当正确送达时才进入判断
    if (props.curInstance.curTaskData) { // 如果当前有任务 调用任务列表接口
      props.curInstance.TaskListData.getEquipmentTaskList();
    } else { // 否则调用开始任务
      setTimeout(() => {
        props.curInstance.getTaskInfo();
      }, 300);
    }
  }
};

watch(() => curActiveInstance.value, () => {
  code.value = '';
});

const handleKeyup = (e: KeyboardEvent) => {
  if (e.code !== 'F8' || curActiveInstance.value !== props.curInstance || !oInput.value) return;
  oInput.value.focus();
};

const onconfirm = (e: { OnlyCurrent: boolean }) => {
  submit(e);

  receiveResult.value = null;
  code.value = '';
};

/* 批量操作相关
-------------------------------- */
const onSingleCompleteClick = (row: ITaskDetail) => { // 单个报工完成
  emit('singleReport', row);
};

const onErrorClick = (row: ITaskDetail) => { // 报错
  emit('error', row);
};

const handleBatchReport = (list, callback) => {
  emit('report', list, callback);
};

onMounted(() => {
  document.body.addEventListener('keyup', handleKeyup);
});

onUnmounted(() => {
  document.body.removeEventListener('keyup', handleKeyup);
});

</script>

<style scoped lang='scss'>
.mp-client-task-activate-and-list-comp-wrap {
  padding: 30px 0;
  > header {
    display: flex;
    align-items: center;
    .el-input {
      width: 318px;
      :deep(.el-input-group__append) {
        background-color: #26bcf9;
        color: #fff;
        box-shadow: 0 0 0 1px #26bcf9;
        height: 30px;
        position: relative;
        top: 1px;
        cursor: pointer;
        font-size: 14px;
        user-select: none;
        transition: 0.12s ease-in-out;
        box-sizing: border-box;
        padding: 0;
        width: 70px;
        text-align: center;
        &:hover {
          box-shadow: 0 0 0 1px #009EF9;
          background-color: #009EF9;
        }
        &:active {
          box-shadow: 0 0 0 1px #35dff9;
          background-color: #35dff9;
        }
      }
    }
    .btn {
      width: 100%;
      display: block;
      text-align: center;
    }
  }
}
</style>
