<template>
  <header class="header-box">
    <LineDateSelectorComp
      :changePropsFunc='setCondition'
      :requestFunc='getList'
      :isFull="true"
      :typeList="[['DateType', ''], ['CreateTime', 'First'], ['CreateTime', 'Second']]"
      :dateList="dateList"
      :dateValue='condition.DateType'
      :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
      label="下单时间"
     />
    <SearchInputComp
      :word='condition.KeyWords'
      title="关键词搜索"
      placeholder="请输入搜索关键词"
      resetWords="清空所有筛选条件"
      :changePropsFunc="(keywords: string) => setCondition([['KeyWords', ''], keywords])"
      :requestFunc='getList'
      :searchWatchKey="list"
      @reset='clearCondition'
     />
  </header>
</template>

<script setup lang='ts'>
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { computed } from 'vue';
import { IManageOrderInfo } from '../../ManualOrderHandlerPage/js/types';
import { Condition } from '../js/Condition';

const props = defineProps<{
  setCondition:(e: ISetConditionParams) => void
  getList:(Page?: number) => void
  condition: Condition
  list: IManageOrderInfo[]
}>();

const emit = defineEmits(['clear']);

const dateList = [
  { name: '近7天订单', ID: 'last7Date' },
  { name: '今天下单', ID: 'today' },
  { name: '昨天下单', ID: 'yesterday' },
  { name: '前天下单', ID: 'beforeyesterday' },
  { name: '本月下单', ID: 'curMonth' },
  { name: '上月下单', ID: 'lastMonth' },
];

const UserDefinedTimeIsActive = computed(() => props.condition.DateType === '' && !!props.condition.CreateTime.First && !!props.condition.CreateTime.Second);

const clearCondition = () => {
  emit('clear');
};

</script>

<style scoped lang='scss'>
.header-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 5px 15px 20px;
  :deep(.mp-line-date-selector-wrap) {
    margin-right: 20px;
    margin-top: 15px;
    line-height: 30px;
    min-width: 800px;
  }
  :deep(.mp-common-comps-search-box) {
    margin-left: 0;
    margin-top: 15px;
    padding-top: 0;
  }
}

</style>
