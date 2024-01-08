<template>
  <header class="header-box">
    <div class="first" v-show="options.showDate">
      <div class="item">
        <span class="title">外协工厂：</span>
        <el-select v-model="_Factory" class="mp-select">
          <el-option v-for="item in FactoryList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>
    </div>
    <div class="second">
      <div class="left">
        <LineDateSelectorComp
          :changePropsFunc='setCondition'
          :requestFunc='getList'
          :isFull="true"
          :typeList="[['DateType', ''], [options.DateType, 'First'], [options.DateType, 'Second']]"
          :dateList="dateList"
          :dateValue='condition.DateType'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          :label="options.DateTitle"
          v-show="options.showDate"
        />
        <div class="item" v-show="!options.showDate">
          <span class="title">外协工厂：</span>
          <el-select v-model="_Factory" class="mp-select">
            <el-option v-for="item in FactoryList" :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </div>
      </div>
      <SearchInputComp
        :word='condition.KeyWords'
        title="关键词搜索"
        placeholder="请输入任务ID或关联ID"
        resetWords="清空所有筛选条件"
        :changePropsFunc="(keywords: string) => setCondition([['KeyWords', ''], keywords])"
        :requestFunc='getList'
        :searchWatchKey="list"
        @reset='clearCondition'
      />
    </div>
  </header>
</template>

<script setup lang='ts'>
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { ISubcontractorFactoryListItemType } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorFactory';
import { computed } from 'vue';
import { Condition } from '../js/Condition';
import { ISwitchOptions } from '../js/type';

const props = defineProps<{
  condition: Condition
  setCondition:(e: ISetConditionParams) => void
  clearCondition:() => void
  getList:(Page?: number) => void
  list: ITaskDetail[]
  FactoryList: Pick<ISubcontractorFactoryListItemType, 'ID' | 'Name'>[]
  options: ISwitchOptions
}>();

const dateList = [
  { name: '近7天下单', ID: 'last7Date' },
  { name: '今天下单', ID: 'today' },
  { name: '昨天下单', ID: 'yesterday' },
  { name: '前天下单', ID: 'beforeyesterday' },
  { name: '本月下单', ID: 'curMonth' },
  { name: '上月下单', ID: 'lastMonth' },
];

const UserDefinedTimeIsActive = computed(() => props.condition.DateType === '' && !!props.options.DateType
 && !!props.condition[props.options.DateType].First && !!props.condition[props.options.DateType].Second);

const _Factory = computed({
  get() {
    return props.condition.Catalog.ID;
  },
  set(val) {
    if (val === props.condition.Catalog.ID) return;
    props.setCondition([['Catalog', 'ID'], val]);
    props.getList();
  },
});

</script>

<style scoped lang='scss'>
.header-box {
  padding: 5px 15px 20px;
  .first {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .second {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  :deep(.mp-line-date-selector-wrap) {
    margin-right: 20px;
    margin-top: 15px;
    line-height: 30px;
    min-width: 800px;
    .title {
      min-width: 6em;
    }
  }
  :deep(.mp-common-comps-search-box) {
    margin-left: 0;
    margin-top: 15px;
    padding-top: 0;
  }

  .item {
    .title {
      min-width: 6em;
      display: inline-block;
      text-align: right;
      margin-right: 10px;
      margin-top: 15px;
      line-height: 30px;
      font-weight: 700;
    }
  }
}

</style>
