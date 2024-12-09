<template>
  <div class="ex-task-detail-display-box" v-if="localInfo">
    <p class="mb-6">
      <span>ID：{{ localInfo.ID }}</span>
    </p>
    <h4 class="mb-8">
      <span>{{ localInfo.WorkingName }}</span>
      <span>数量：{{ localInfo.Count }}</span>
    </h4>
    <div class="mb-18">
      <span>工厂：{{ localInfo.Factory }}</span>
      <span>金额：￥{{ localInfo.Amount }}元</span>
    </div>
    <h4 class="mb-6">
      <span style="line-height: 30px;">制作要求：{{ localInfo.ProcessContent }}</span>
    </h4>
    <div>
      <span>外协时间：{{ localInfo.DateTime }}</span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { IExternalReportResult } from '../../js/types';

const props = defineProps<{
  result?: IExternalReportResult | null
  row?: ReturnType<typeof getLocalTaskList>[number] | null
}>();

const localInfo = computed(() => {
  if (!props.result && !props.row) return null;

  return {
    ID: props.result?.TaskCode || props.row?.Code,
    WorkingName: props.result?.WorkingName || props.row?._WorkingName,
    Count: props.result ? `${props.result.Number}${props.result.Unit}` : props.row?._Number,
    Amount: props.result ? +`${props.result.Amount ? props.result.Amount.toFixed(2) : 0}` : props.row?._ExternalSubmitParams.Amount,
    Factory: props.result?.Equipment.Name || props.row?._ExternalSubmitParams._FactoryName,
    ProcessContent: props.result?.ProcessContent || props.row?._AssistText,
    DateTime: props.result ? format2MiddleLangTypeDateFunc2(props.result.WishFinishedTime) : props.row?._StartTime,
  };
});
</script>

<style scoped lang='scss'>
.ex-task-detail-display-box {
  color: #444;
  padding-left: 35px;
  padding-right: 20px;
  font-size: 21px;
  line-height: 24px;

  > p, > div, > h4 {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > span {
      &:last-of-type {
        min-width: 200px;
      }
    }
  }

  &.d-confirming {
    padding-bottom: 20px;
    > p {
      font-size: 30px;
    }
    h4 {
      font-size: 28px;
      margin-top: 30px;
      margin-bottom: 14px;
    }
  }
}
</style>
