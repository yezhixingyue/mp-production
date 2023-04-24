<template>
  <!-- 错误信息 -->
  <ErrorContent v-if="curInstance.ErrorInfo" :ErrorInfo="curInstance.ErrorInfo" />

  <!-- 恢复按钮 -->
  <p class="btn-box" v-show="curInstance.ErrorInfo">
    <mp-button type="primary" class="gradient" @click="onClick">恢复生产</mp-button>
  </p>

  <!-- 待转换列表 -->
  <TaskListTable v-if="curInstance.ErrorInfo && curInstance.ErrorInfo.TaskList?.length > 0" useLittleHeight :TaskList="curInstance.ErrorInfo.TaskList" isError/>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { TerminalEquipmentInstance } from '@/views/ProductionClient/assets/js/Instance';
import ErrorContent from './ErrorContent.vue';
import TaskListTable from '../../TaskActivateAndList/TaskListTable.vue';

const props = defineProps<{
  curInstance: Required<TerminalEquipmentInstance>
}>();

const onClick = () => {
  MpMessage.warn({
    title: '确定要恢复生产吗 ?',
    msg: `设备：[ ${props.curInstance.EquipmentDisplayName} ]`,
    onOk: () => {
      props.curInstance.getEquipmentRenew();
    },
  });
};

</script>

<style scoped lang='scss'>

.btn-box {
  margin-top: 40px;
  text-align: center;
  margin-bottom: 60px;
  .el-button {
    width: 207px;
    height: 60px;
    font-size: 24px;
    border-radius: 4px;
  }
}
</style>
