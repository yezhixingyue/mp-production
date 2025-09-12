<template>
  <div class="header" v-if="taskDetail" style="line-height: 1.8em;">
    <p style="display: flex;justify-content: space-between;">
      <span>生产线：{{ taskDetail.LineName }}</span>

      <span style="color: #888;" v-if="!isPrint">任务ID： {{ taskDetail.Code }}</span>
    </p>

    <p>工序：{{ taskDetail.WorkingName }}</p>

    <h3 style="font-size: 1.23em;margin: 0.3em 0;">生产设备：{{ taskDetail.Equipment.Name }}</h3>

    <div style="display: flex;justify-content: space-between;">
      <span>任务工期：{{ getDateYmdmsFormat(taskDetail.WishFinishTime, '之前') }}</span>
      <span>订单工期：{{ getDateYmdmsFormat(taskDetail.OrderInfo.ProduceEndTime, '之前') }}</span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { getDateYmdmsFormat } from '@/assets/js/utils/ConvertTimeFormat';
import { IUnionTaskDetail } from '../../types/type';

defineProps<{
  taskDetail: null | IUnionTaskDetail
  isPrint?: boolean
}>();
</script>

<style scoped lang='scss'>
</style>
