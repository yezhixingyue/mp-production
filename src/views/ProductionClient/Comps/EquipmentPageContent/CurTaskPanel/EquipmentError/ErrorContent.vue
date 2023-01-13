<template>
  <div class="error-content">
    <h2 class="icon-box">
      <el-icon><SuccessFilled /></el-icon>
      <span>已成功报停!</span>
    </h2>
    <p class="remark">
      <span>报停原因：</span>
      <span>{{ ErrorInfo.ErrorTips }}</span>
    </p>
    <!-- 如果有替换设备 -->
    <template v-if="ErrorInfo.HaveReplaceEquipment">
      <h2>本机所有可生产任务</h2>
      <h2>已转至 <i class="red">{{ [ErrorInfo.Equipment.GroupName, ErrorInfo.Equipment.Name].join('-') }}</i> 生产</h2>
    </template>
    <!-- 如果没有替换设备 -->
    <h4 v-else>{{ ErrorInfo.Remark }}</h4>
  </div>
</template>

<script setup lang='ts'>
import { IEquipmentErrorInfo } from '@/views/ProductionClient/assets/js/types';

defineProps<{
  ErrorInfo: IEquipmentErrorInfo
}>();
</script>

<style scoped lang='scss'>
.error-content {
  text-align: center;
  padding-top: 40px;
  font-size: 20px;
  h2 {
    font-size: 30px;
    line-height: 40px;
    &.icon-box {
      color: #52C41A;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        font-size: 70px;
        margin-right: 6px;
      }
    }

    .red {
      color: #FF0000;
    }
  }
  .remark {
    margin-top: 16px;
    margin-bottom: 28px;
  }
  > h4 {
    padding-bottom: 12px;
  }
}
</style>
