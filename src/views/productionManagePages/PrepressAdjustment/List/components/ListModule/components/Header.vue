<template>
  <header class="header">
    <div v-if="type === AdjustTabTypeEnum.AddNumber && Permission?.Obj.AddNumberSetup" class="pb-20">
      <mp-button type="primary" @click="emit('addNumber')">+ 追加印刷数量</mp-button>
    </div>

    <div class="menu">
      <span v-for="it in curFilterLineList" :key="it.ID" :class="{ active: it.ID === moduleData.condition.LineID }"
        @click="onClick(it.ID)">{{ it.Name }}</span>
    </div>

    <div class="second">
      <LineDateSelectorComp :changePropsFunc='moduleData.condition.setCondition.bind(moduleData.condition)'
        :requestFunc='moduleData.getList.bind(moduleData)' :isFull="true"
        :typeList="[['DateType', ''], ['CreateTime', 'First'], ['CreateTime', 'Second']]" :dateList="dateList"
        :dateValue='moduleData.condition.DateType' :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        :label="type === AdjustTabTypeEnum.AddNumber ? '印数追加时间' : '订单创建时间'" />

      <SearchInputComp :word='moduleData.condition.KeyWords' title="关键词搜索" placeholder="请输入订单号，原因等" resetWords="清空所有筛选条件"
        :changePropsFunc="(keywords: string) => moduleData.condition.setCondition([['KeyWords', ''], keywords])"
        :requestFunc='moduleData.getList.bind(moduleData)' :searchWatchKey="moduleData.list"
        @reset='() => moduleData.clearCondition()' />
    </div>
  </header>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { localPrepressAdjModel } from '@/views/productionManagePages/PrepressAdjustment/store';
import { PrepressAdjustmentManageModel } from '@/views/productionManagePages/PrepressAdjustment/model/PrepressAdjustmentManageModel';
import { AdjustTabTypeEnum } from '@/views/productionManagePages/PrepressAdjustment/types/enum';
import { AdjustListManageModel } from '../../../model/AdjustListManageModel';

const props = defineProps<{
  type: AdjustTabTypeEnum
  moduleData: AdjustListManageModel
  Permission: PrepressAdjustmentManageModel['Permission']
}>();

const emit = defineEmits(['addNumber']);

const curFilterLineList = computed(() => {
  const { ProductionLineList, allAuthorizedLineIDs } = localPrepressAdjModel.value;
  const list = ProductionLineList.map(it => ({ ID: it.ID, Name: it.Name })).filter(it => allAuthorizedLineIDs.includes(it.ID));
  list.unshift({ ID: '', Name: '所有生产线' });

  return list;
});

const onClick = (e: string) => {
  props.moduleData.condition.setCondition([['LineID', ''], e]);
  props.moduleData.getList();
};

const dateList = props.type === AdjustTabTypeEnum.AddNumber ? [
  { name: '近7天', ID: 'last7Date' },
  { name: '今天', ID: 'today' },
  { name: '昨天', ID: 'yesterday' },
  { name: '本月', ID: 'curMonth' },
  { name: '上月', ID: 'lastMonth' },
] : [
  { name: '近7天下单', ID: 'last7Date' },
  { name: '今天下单', ID: 'today' },
  { name: '昨天下单', ID: 'yesterday' },
  { name: '本月下单', ID: 'curMonth' },
  { name: '上月下单', ID: 'lastMonth' },
];
const UserDefinedTimeIsActive = computed(() => props.moduleData.condition.DateType === ''
  && !!props.moduleData.condition.CreateTime.First && !!props.moduleData.condition.CreateTime.Second);
</script>

<style scoped lang='scss'>
.header {

  display: flex;
  flex-direction: column;

  >.menu {
    flex: none;
    white-space: wrap;
    max-width: 100%;
    margin-right: 43px;

    >span {
      display: inline-block;
      line-height: 28px;
      padding: 0 17px;
      box-shadow: 0 0 0 1px #e8e8e8;
      cursor: pointer;
      background-color: #f5f5f5;
      color: #444;
      transition: 0.15s ease-in-out;
      position: relative;

      &:hover {
        background-color: #eee;
      }

      &.active {
        color: #26bcf9;
        background-color: #fff;
        box-shadow: 0 0 0 1px #26bcf9;
        z-index: 2;
      }
    }
  }

  >.second {
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    flex-wrap: wrap;

    >* {
      margin-top: 15px;
      height: 30px;
      padding-top: 0;
      margin-left: 0;
    }

    :deep(.mp-line-date-selector-wrap) {
      > .title {
        width: 93px;
      }
    }
  }
}
</style>
