<template>
  <header class="header-box">
    <div class="first" :class="{full: options.showDate}">
      <div class="item">
        <span class="title">外协工厂：</span>
        <el-select v-model="_Factory" class="mp-select" filterable>
          <el-option v-for="item in FactoryList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>

      <EpCascaderWithLevel3
         title="生产线/制版组"
         showLine
        :fiexdWidth="240"
        :setCondition='setCondition'
        :levelTreeList='LineAndMakingGroupTreeList'
        :First='condition.Line._Type'
        :Second='condition.Line.First'
        :Third='condition.Line.Second'
        :getList="getList"
        offFirst
        :typeList="[['Line', '_Type'], ['Line', 'First'], ['Line', 'Second']]"
        :defaultProps="{ ID: 'ID', Name: 'Name', children: 'children' }"
        style="margin-right: 20px;"
      />

      <div class="item" v-if="options.showStatusFilter">
        <span class="title">外协状态：</span>
        <el-select v-model="_ExternalTaskStatus" class="mp-select">
          <el-option v-for="item in localExternalTaskStatusEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>

      <StaffSelector v-model="_SendOperator" title="外协操作人" />
    </div>
    <LineDateSelectorComp
      :changePropsFunc='setCondition'
      :requestFunc='getList'
      :isFull="true"
      :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
      :label="options.DateTitle"
      :menu="{
        radio: condition.DateTypeRadio,
        list: [
          {
            label: '创建时间',
            value: ExternalTaskDateTypeRadioEnum.Create,
            dateList: dateList,
            dateMenuEnum: condition.CreateTimeDateType,
            typeList: [['CreateTimeDateType', ''], ['CreateTime', 'First'], ['CreateTime', 'Second']],
          },
          {
            label: '预计完成时间',
            value: ExternalTaskDateTypeRadioEnum.ExpectedFinish,
            dateList: dateList2,
            dateMenuEnum: condition.WishFinishTimeDateType,
            typeList: [['WishFinishTimeDateType', ''], ['WishFinishTime', 'First'], ['WishFinishTime', 'Second']],
          },
          {
            label: '外协入库时间',
            value: ExternalTaskDateTypeRadioEnum.FinishTime,
            dateList: dateList,
            dateMenuEnum: condition.FinishTimeDateType,
            typeList: [['FinishTimeDateType', ''], ['FinishTime', 'First'], ['FinishTime', 'Second']],
          },
        ]
      }"
      v-show="options.showDate"
      />
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
  </header>
</template>

<script setup lang='ts'>
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import EpCascaderWithLevel3 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderWithLevel3.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { ISubcontractorFactoryListItemType } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorFactory';
import { computed, onMounted } from 'vue';
import { debounce } from '@/components/common/EpCascader/assets/utils';
import StaffSelector from '@/components/common/ElementPlusContainners/StaffSelector.vue';
import { Condition } from '../js/Condition';
import { ISwitchOptions } from '../js/type';
import { ManageListClass } from '../js/ManageListClass';
import { ExternalTaskStatusEnumList } from '../js/EnumList';
import { ExternalTaskStatusEnum, ExternalTaskDateTypeRadioEnum } from '../js/enum';

const props = defineProps<{
  condition: Condition
  setCondition:(e: ISetConditionParams) => void
  clearCondition:() => void
  getList:(Page?: number) => void
  list: ITaskDetail[]
  FactoryList: Pick<ISubcontractorFactoryListItemType, 'ID' | 'Name'>[]
  options: ISwitchOptions
  LineAndMakingGroupTreeList: ManageListClass['LineAndMakingGroupTreeList']
}>();

const dateList = [
  { name: '近7天', ID: 'last7Date' },
  { name: '今天', ID: 'today' },
  { name: '昨天', ID: 'yesterday' },
  { name: '前天', ID: 'beforeyesterday' },
  { name: '本月', ID: 'curMonth' },
  { name: '上月', ID: 'lastMonth' },
];
const dateList2 = [
  { name: '未来7天', ID: 'next7Date' },
  { name: '今天', ID: 'today' },
  { name: '明天', ID: 'tomorrow' },
  { name: '后天', ID: 'theDayAfterTomorrow' },
  { name: '本月', ID: 'curMonth' },
  { name: '下月', ID: 'nextMonth' },
];

const localExternalTaskStatusEnumList = computed(() => {
  const _list = ExternalTaskStatusEnumList
    .filter(it => (props.options.OnlyStatusList ? props.options.OnlyStatusList.includes(it.ID as ExternalTaskStatusEnum) : true));

  return [{ ID: '', Name: '不限' }, ..._list];
});

const UserDefinedTimeIsActive = computed(() => {
  if (props.condition.DateTypeRadio === ExternalTaskDateTypeRadioEnum.Create) {
    return props.condition.CreateTimeDateType === ''
      && !!props.condition.CreateTime.First
      && !!props.condition.CreateTime.Second;
  }

  if (props.condition.DateTypeRadio === ExternalTaskDateTypeRadioEnum.FinishTime) {
    return props.condition.FinishTimeDateType === ''
      && !!props.condition.FinishTime.First
      && !!props.condition.FinishTime.Second;
  }

  return props.condition.WishFinishTimeDateType === ''
    && !!props.condition.WishFinishTime.First
    && !!props.condition.WishFinishTime.Second;
});

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

const _ExternalTaskStatus = computed({
  get() {
    return props.condition.ExternalStatus;
  },
  set(val) {
    if (val === props.condition.ExternalStatus) return;
    props.setCondition([['ExternalStatus', ''], val]);
    props.getList();
  },
});

const _SendOperator = computed({
  get() {
    return props.condition.SendOperator;
  },
  set(val) {
    props.setCondition([['SendOperator', ''], val]);
    props.getList();
  },
});

onMounted(() => {
  const _ResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback) {
      // eslint-disable-next-line no-param-reassign
      callback = debounce(callback, 16, false);
      super(callback);
    }
  };
});
</script>

<style scoped lang='scss'>
.header-box {
  padding: 5px 15px 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  .first {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 15px;

    &.full {
      width: 100%;
    }
  }
  :deep(.mp-line-date-selector-wrap) {
    margin-right: 20px;
    margin-top: 15px;
    line-height: 30px;
    min-width: 1100px;
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
      // margin-top: 15px;
      line-height: 30px;
      font-weight: 700;
    }
    margin-right: 20px
  }
}

</style>
