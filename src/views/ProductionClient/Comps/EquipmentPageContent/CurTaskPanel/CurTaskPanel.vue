<template>
  <div v-if="curInstance" class="mp-client-cur-task-panel-comp-wrap">
    <EquipmentError v-if="curInstance.Equipment.Status === EquipmentStatusEnum.failure && curInstance.loginData.token" :curInstance="curInstance" />
    <el-empty description="暂无任务" v-else-if="!curInstance.curTaskData && !curInstance.isCurTaskLoading && curInstance.loginData.token" />
    <div class="task-box" v-else-if="curInstance.curTaskData">
      <!-- 左侧文字和按钮信息 -->
      <PanelLeft :TaskData="curInstance.curTaskData" @complete="onCompleteClick" @error="onErrorClick" />

      <!-- 右侧文件和图片信息 -->
      <PanelRight :TaskData="curInstance.curTaskData" />

      <!-- 报错弹窗 -->
      <SetTaskErrorDialog v-model:visible="errorVisible" :curInstance="curInstance" @set-error="handleTaskSetError" />

      <!-- 加工完成弹窗 -->
      <SetTaskCompleteDialog v-model:visible="completeVisible" :curInstance="curInstance" @complete="handleTaskSetComplete" />
    </div>

    <!-- 设置任务送达及任务列表展示组件 -->
    <TaskActivateAndList v-if="curInstance" :curInstance="curInstance" />
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { TerminalEquipmentInstance } from '@/views/ProductionClient/assets/js/Instance';
import { EquipmentStatusEnum } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/enum';
import PanelLeft from './PanelLeft.vue';
import PanelRight from './PanelRight.vue';
import SetTaskErrorDialog from './SetTaskErrorDialog.vue';
import SetTaskCompleteDialog from './SetTaskCompleteDialog.vue';
import TaskActivateAndList from '../TaskActivateAndList/TaskActivateAndList.vue';
import EquipmentError from './EquipmentError/EquipmentErrorPanel.vue';

const props = defineProps<{
  curInstance: Required<TerminalEquipmentInstance>
}>();

/* 报错相关
------------------------------------------------ */
const errorVisible = ref(false);
const onErrorClick = () => {
  errorVisible.value = true;
};
const handleTaskSetError = (reason: string) => {
  const cb = () => {
    errorVisible.value = false;
  };
  // 处理方法可添加到实例类中处理
  props.curInstance.setTaskError(reason, cb);
};

/* 加工完成相关
----------------------------------------------- */
const completeVisible = ref(false);
const onCompleteClick = () => {
  completeVisible.value = true;
};
const handleTaskSetComplete = (count: number | '') => {
  const cb = () => {
    completeVisible.value = false;
  };
  props.curInstance.setTaskComplete(count, cb);
};

</script>

<style scoped lang='scss'>
.mp-client-cur-task-panel-comp-wrap {
  padding: 0px 60px 20px;
  box-sizing: border-box;
  .task-box {
    display: flex;
  }
  .el-empty {
    margin-top: 10vh;
    margin-bottom: 80px;
  }
}
</style>
