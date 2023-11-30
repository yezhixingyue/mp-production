<template>
  <div class="ex-task-detail-display-box">
    <p class="mb-6">
      <span>ID：{{ result.TaskCode }}</span>
    </p>
    <h4 class="mb-8">
      <span>{{ result.WorkingName }}</span>
      <span>数量：{{ result.Number }}{{ result.Unit }}</span>
    </h4>
    <div class="mb-18">
      <span>工厂：{{ result.Equipment.Name }}</span>
      <span>金额：￥{{ result.Amount ? +`${result.Amount.toFixed(2)}` : '' }}元</span>
    </div>
    <h4 class="mb-6">
      <span>制作要求：{{ result.ProcessContent }}</span>
    </h4>
    <div>
      <span>外协时间：{{ format2MiddleLangTypeDateFunc2(result.WishFinishedTime) }}</span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { IExternalReportResult } from '../../js/types';

defineProps<{
  result: IExternalReportResult
}>();
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
