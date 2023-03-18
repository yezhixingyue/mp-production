<template>
  <div>
    <!-- 大版报工 -->
    <div v-if="ReportMode === ReportModeEnum.board">
      <span v-for="it in RedoInfo.PlateList" :key="it.ID">
        {{ it.WorkingList.map(w => getWorkingContent(w)).join('、') }}
      </span>
    </div>

    <!-- 订单报工 -->
    <div v-if="ReportMode === ReportModeEnum.order && RedoInfo.UnionLine">
      <span>{{ RedoInfo.UnionLine.Name }}：</span>
      <span>{{ RedoInfo.UnionLine.WorkingList.map(w => getWorkingContent(w)).join('、') }}</span>
    </div>

    <!-- 订单报工或块报工下的大版处理列表 -->
    <RedoPlateListDiaplay v-if="[ReportModeEnum.order, ReportModeEnum.block].includes(ReportMode)" :PlateList="RedoInfo.PlateList" />
  </div>
</template>

<script setup lang='ts'>
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { IRedoDetail } from '../js/type';
import { getWorkingContent } from '../js/utils';
import RedoPlateListDiaplay from './RedoPlateListDiaplay.vue';

defineProps<{
  RedoInfo: IRedoDetail
  ReportMode: ReportModeEnum
}>();

</script>

<style scoped lang='scss'>
</style>
