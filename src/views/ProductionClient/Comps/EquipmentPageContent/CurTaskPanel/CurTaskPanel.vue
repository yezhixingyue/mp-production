<template>
  <div v-if="curInstance" class="mp-client-cur-task-panel-comp-wrap" :class="{op:curInstance.scrollInfo.willScroll}">
    <div v-if="localAssistantList && localAssistantList.length > 0" class="assistant-list">
      <div v-for="it in localAssistantList" :key="it.TypeID + '-' + it.index">
        <span class="is-bold ml-20" :class="{star: it.Required}">{{ it.TypeName }}：</span>
        <span class="is-gray">{{ it.MemberName || '无' }}</span>
      </div>
      <span class="is-blue-span ml-20" @click="emit('setAssistant')">设置</span>
    </div>

    <EquipmentError v-if="curInstance.Equipment.Status === EquipmentStatusEnum.failure && curInstance.loginData.token && curInstance.loginData.AssistantList"
     :curInstance="curInstance" />
    <el-empty description="暂无任务" v-else-if="_IsEmpty" :class="{'v-hide': props.curInstance.TaskListData.loading}" />
    <div class="task-box" v-else-if="curInstance.curTaskData || (curInstance.Equipment.AllowBatchReport && curInstance.TaskListData.TaskList.length > 0)">
      <template v-if="curInstance.curTaskData">
        <!-- 左侧文字和按钮信息 -->
        <PanelLeft :TaskData="curInstance.curTaskData" @complete="onCompleteClick" @error="onErrorClick" />

        <!-- 右侧文件和图片信息 -->
        <PanelRight :TaskData="curInstance.curTaskData" />
      </template>

      <!-- 报错弹窗 -->
      <!-- <SetTaskErrorDialog v-model:visible="errorVisible" :TaskData="curSelectTask" @set-error="handleTaskSetError" /> -->

      <!-- 加工完成弹窗 -->
      <SetTaskCompleteDialog v-model:visible="completeVisible" :TaskData="curSelectTask" @complete="handleTaskSetComplete" />
    </div>

    <!-- 设置任务送达及任务列表展示组件 -->
    <TaskActivateAndList
      v-if="curInstance"
      :curInstance="curInstance"
      @singleReport="onCompleteClick"
      @error="onErrorClick"
      @report="handleBatchReport"
    />
  </div>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { TerminalEquipmentInstance } from '@/views/ProductionClient/assets/js/Instance';
import { EquipmentStatusEnum } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/enum';
import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { ManageClientPageData } from '@/api/client/clientStore';
import PanelLeft from './PanelLeft.vue';
import PanelRight from './PanelRight.vue';
// import SetTaskErrorDialog from './SetTaskErrorDialog.vue';
import SetTaskCompleteDialog from './SetTaskCompleteDialog.vue';
import TaskActivateAndList from '../TaskActivateAndList/TaskActivateAndList.vue';
import EquipmentError from './EquipmentError/EquipmentErrorPanel.vue';
import { getAssistantParamsList, getAssistantRuleFormObj } from '../Assistant/utils';

const props = defineProps<{
  curInstance: Required<TerminalEquipmentInstance>
}>();
const emit = defineEmits(['sendError', 'setAssistant']);

// 助手列表
const localAssistantList = computed(() => {
  if (!props.curInstance.loginData.AssistantList) return null;

  if (!props.curInstance.NeedBindAssistantList) {
    return props.curInstance.loginData.AssistantList;
  }

  return getAssistantParamsList(
    getAssistantRuleFormObj(props.curInstance.NeedBindAssistantList, props.curInstance.loginData.AssistantList),
    props.curInstance.NeedBindAssistantList,
  );
});

// watch(() => localAssistantList.value, () => {
//   if (handled) return;
//   console.log(localAssistantList.value, props.curInstance.loginData.AssistantList);
// });

/* 展示相关
------------------------------------------------ */
const _IsEmpty = computed(() => {
  if (!props.curInstance.loginData.token) return false;
  if (!props.curInstance.loginData.AssistantList) return false;
  if (!props.curInstance.Equipment.AllowBatchReport) { // 单个报工
    return !props.curInstance.curTaskData && !props.curInstance.isCurTaskLoading;
  }
  // 批量报工
  return props.curInstance.TaskListData.TaskList.length === 0;
});

/* 报错相关
------------------------------------------------ */
const curSelectTask = ref<ITaskDetail | null>(null);

// const errorVisible = ref(false);
const onErrorClick = (task: null | ITaskDetail) => {
  emit('sendError', task || props.curInstance.curTaskData);
  // curSelectTask.value = task || props.curInstance.curTaskData;
  // errorVisible.value = true;
};
// const handleTaskSetError = (reason: string) => {
//   const cb = () => {
//     errorVisible.value = false;
//   };
//   // 处理方法可添加到实例类中处理
//   props.curInstance.setTaskError(reason, cb, curSelectTask.value?.ID);
// };

/* 加工完成相关
----------------------------------------------- */
const completeVisible = ref(false);
const onCompleteClick = (task: null | ITaskDetail) => {
  curSelectTask.value = task || props.curInstance.curTaskData;
  completeVisible.value = true;
};
const handleTaskSetComplete = (count: number | '') => {
  const cb = () => {
    completeVisible.value = false;
    ManageClientPageData.value.websocketHandler.start();
  };
  props.curInstance.setTaskComplete(count, cb, curSelectTask.value || undefined);
};

const handleBatchReport = (list, callback) => {
  const cb = () => {
    callback();
    ManageClientPageData.value.websocketHandler.start();
  };
  props.curInstance.getEquipmentTaskBatchReport(list, cb);
};

</script>

<style scoped lang='scss'>
.mp-client-cur-task-panel-comp-wrap {
  padding: 38px 60px 20px;
  box-sizing: border-box;
  .task-box {
    display: flex;
  }
  .el-empty {
    margin-top: 10vh;
    margin-bottom: 80px;
    &.v-hide {
      visibility: hidden;
    }
  }

  &.op {
    opacity: 0;
  }

  position: relative;
  .assistant-list {
    position: absolute;
    right: 85px;
    top: 6px;
    font-size: 13px;
    white-space: nowrap;

    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>
