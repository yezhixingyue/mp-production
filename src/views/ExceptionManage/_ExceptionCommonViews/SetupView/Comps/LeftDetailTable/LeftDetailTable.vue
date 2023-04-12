<template>
  <ul class="left column scroll">
    <ItemTableInfo v-for="item in displayList" :key="item.title" :tableItem="item" @menuclick="onmenuclick" />
    <li class="mt-20">
      <p class="mp-common-title-wrap black">情况信息：</p>
      <h4 class="is-red remark">{{ TaskExceptionDetail.Remark }}</h4>
      <div>
        <span class="mr-25">提交时间：{{ format2MiddleLangTypeDateFunc2(TaskExceptionDetail.CreateTime) }}</span>
        <span>提交人：<i class="is-bold">{{ TaskExceptionDetail.SubmitterName }}</i></span>
      </div>
    </li>
  </ul>
</template>

<script setup lang='ts'>
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { computed } from 'vue';
import { ITaskExceptionDetail } from '../../../js/type';
import { loadBarcode } from '../../js/utils';
import ItemTableInfo from './ItemTableInfo.vue';
import { getLeftDisplayList, leftEventType } from './util';

/**
 * 关于展示内容：
 * 1. 大版报工时展示：任务信息、大版信息
 * 2. 订单报工时展示：任务信息、订单信息
 * 3. 按块报工时展示：任务信息、大版信息(? 或可合并至块信息展示中)、块信息、订单信息
 *
 * 最后都展示错误提交信息
 */
const props = defineProps<{
  TaskExceptionDetail: Partial<ITaskExceptionDetail> & Omit<ITaskExceptionDetail, 'PlateList' | 'UnionLine'>
  IsOutSourcing: boolean
}>();

const displayList = computed(() => getLeftDisplayList(props.TaskExceptionDetail.TaskDetail, props.IsOutSourcing, !!props.TaskExceptionDetail.PlateList));

const onmenuclick = (label: leftEventType) => {
  switch (label) {
    case 'BarCodePrint':
      if (props.TaskExceptionDetail.TaskDetail.Working.PlateInfo) {
        loadBarcode(props.TaskExceptionDetail.TaskDetail.Working.PlateInfo);
      }
      break;

    default:
      break;
  }
};
</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.left {
  width: 460px;
  padding-right: 20px;
  min-width: 300px;
  @include scroll;

  .remark {
    line-height: 18px;
    font-size: 14px;
    margin: 6px 0;
    text-indent: 1em;
  }
}
</style>
