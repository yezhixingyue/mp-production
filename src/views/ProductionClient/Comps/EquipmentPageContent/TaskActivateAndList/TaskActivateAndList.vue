<template>
  <section
    class="mp-client-task-activate-and-list-comp-wrap"
    v-if="curInstance && curInstance.loginData.token && curInstance.Equipment.Status === EquipmentStatusEnum.normal"
    v-show="!curActiveInstance?.isCurTaskLoading">
    <!-- 1. 设置送达 -->
    <header>
      <h4>条码ID：</h4>
      <el-input v-model.trim="code" maxlength="20" ref="oInput" @keydown.enter="submit">
        <template #append>
          <span class="btn" @click="submit">送达</span>
        </template>
      </el-input>
    </header>

    <!-- 2. 列表展示 -->
    <TaskListTable :TaskList="curInstance.TaskListData.TaskList" :loading="curInstance.TaskListData.loading" />

    <!-- 送达结果弹窗处理 -->
    <ResultHandleDialog v-model:visible="resultVisible" :result="receiveResult" @close="onClose" @submit="onDialogSubmit" />
  </section>
</template>

<script setup lang='ts'>
import { ManageClientPageData } from '@/api/client/clientStore';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { EquipmentReceiveCodeEnum } from '@/views/ProductionClient/assets/js/enum';
import { TerminalEquipmentInstance } from '@/views/ProductionClient/assets/js/Instance';
import { IReceiveResult } from '@/views/ProductionClient/assets/js/types';
import { EquipmentStatusEnum } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/enum';
import {
  onMounted, ref, computed, onUnmounted, watch,
} from 'vue';
import ResultHandleDialog from './ResultHandleDialog.vue';
import TaskListTable from './TaskListTable.vue';

const props = defineProps<{
  curInstance: Required<TerminalEquipmentInstance>
}>();

const curActiveInstance = computed(() => ManageClientPageData.value.curActiveInstance);

const code = ref('');

const oInput = ref<InstanceType<typeof HTMLInputElement>>();

const setInputFocus = () => { // 聚焦
  if (oInput.value) oInput.value?.focus();
};

const resultVisible = ref(false);
const receiveResult = ref<IReceiveResult | null>(null);

const onClose = () => {
  receiveResult.value = null;
  code.value = '';
  setInputFocus();
};

const submit = async () => {
  if (!oInput.value) return;
  oInput.value.blur();

  if (!code.value) {
    MpMessage.error({
      title: '条码ID不能为空', msg: '请扫描条码或输入条码编号', onCancel: setInputFocus, onOk: setInputFocus,
    });
    return;
  }
  const result = await props.curInstance.getEquipmentReceive(code.value, setInputFocus);
  if (result) {
    // 1. 处理结果 多种可能
    receiveResult.value = result;
    resultVisible.value = true;
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

onMounted(() => {
  document.body.addEventListener('keyup', handleKeyup);
});

onUnmounted(() => {
  document.body.removeEventListener('keyup', handleKeyup);
});

</script>

<style scoped lang='scss'>
.mp-client-task-activate-and-list-comp-wrap {
  padding-top: 30px;
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
