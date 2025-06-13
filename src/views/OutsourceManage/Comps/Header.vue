<template>
  <header class="header-box">
    <div class="first" :class="{full: options.showDate}">
      <div class="item">
        <span class="title">外协工厂：</span>
        <el-select v-model="_Factory" class="mp-select">
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
      />

      <div class="item" v-if="options.showStatusFilter" style="margin-left: 20px;">
        <span class="title">外协状态：</span>
        <el-select v-model="_ExternalTaskStatus" class="mp-select">
          <el-option v-for="item in localExternalTaskStatusEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>

      <StaffSelector v-model="_Operator" title="操作人" />
    </div>
    <LineDateSelectorComp
      :changePropsFunc='setCondition'
      :requestFunc='getList'
      :isFull="true"
      :typeList="[['DateType', ''], ['CreateTime', 'First'], ['CreateTime', 'Second']]"
      :dateList="dateList"
      :dateValue='condition.DateType'
      :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
      :label="options.DateTitle"
      :menu="{
        radio: condition.DateTypeRadio,
        list: [
          { label: '创建时间', value: ExternalTaskDateTypeRadioEnum.Create },
          { label: '预计完成时间', value: ExternalTaskDateTypeRadioEnum.ExpectedFinish },
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
  { name: '近7天下单', ID: 'last7Date' },
  { name: '今天下单', ID: 'today' },
  { name: '昨天下单', ID: 'yesterday' },
  { name: '前天下单', ID: 'beforeyesterday' },
  { name: '本月下单', ID: 'curMonth' },
  { name: '上月下单', ID: 'lastMonth' },
];

const localExternalTaskStatusEnumList = computed(() => {
  const _list = ExternalTaskStatusEnumList
    .filter(it => (props.options.OnlyStatusList ? props.options.OnlyStatusList.includes(it.ID as ExternalTaskStatusEnum) : true));

  return [{ ID: '', Name: '不限' }, ..._list];
});

const UserDefinedTimeIsActive = computed(() => props.condition.DateType === ''
&& !!props.condition.CreateTime.First && !!props.condition.CreateTime.Second);

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

const _Operator = computed({
  get() {
    return props.condition.Operator;
  },
  set(val) {
    props.setCondition([['Operator', ''], val]);
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
    min-width: 1050px;
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
