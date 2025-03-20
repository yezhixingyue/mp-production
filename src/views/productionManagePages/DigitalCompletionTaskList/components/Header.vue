<template>
  <header class="header">
    <div>
      <EpCascaderByLevel2
         title="生产线"
         showLine
        :fiexdWidth="180"
        @setCondition='setCondition'
        :list='LineList'
        :First='ManageTaskListData.condition.Line.First'
        :Second='ManageTaskListData.condition.Line.Second'
        @getList="getList"
        :typeList="[['Line', 'First'],['Line', 'Second']]"
        :defaultProps="{ ID: 'ID', Name: 'Name', children: 'WorkingProcedures' }"
        class="mr-20"
      />
      <EpCascaderWithLevel3
         title="设备"
        :setCondition='setCondition'
        :levelTreeList='EquipmentFilterData.EquipmentClassAndGroupLevelList'
        :First='ManageTaskListData.condition.Catalog.ClassID'
        :Second='ManageTaskListData.condition.Catalog.GroupID'
        :Third='ManageTaskListData.condition.Catalog.ID'
        :getList="getList"
        :typeList="[['Catalog', 'ClassID'],['Catalog', 'GroupID'],['Catalog', 'ID']]"
        class="mr-20"
      />
      <StaffSelector v-model="_Operator" title="操作人" />
      <i class="flexible"></i>
      <SearchInputComp
        :word='ManageTaskListData.condition.KeyWords'
        title="关键词搜索"
        class="mt-5 mr-80"
        placeholder="请输入搜索关键词"
        resetWords="清空所有筛选条件"
        :changePropsFunc="(keywords: string) => setCondition([['KeyWords', ''], keywords])"
        :requestFunc='getList'
        :searchWatchKey="ManageTaskListData.list"
        @reset='() => ManageTaskListData.clearCondition()'
      />
    </div>
    <div>
      <LineDateSelectorComp
        :changePropsFunc='setCondition'
        :requestFunc='getList'
        :isFull="true"
        :typeList="[['DateType', ''], ['FinishTime', 'First'], ['FinishTime', 'Second']]"
        :dateList="dateList"
        :dateValue='ManageTaskListData.condition.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        label="完成时间"
        dateType="datetimerange"
        class="mr-20"
        style="min-width: 850px;"
      />

      <div class="item">
        <span class="title">时长筛选：</span>
        <el-radio-group v-model="_Compare">
          <el-radio label="">不限</el-radio>
          <el-radio v-for="it in TaskListConditionCompareEnumList" :key="it.ID" :label="it.ID">{{ it.Name }}</el-radio>
        </el-radio-group>
      </div>
    </div>
  </header>
</template>

<script setup lang='ts'>
import EpCascaderByLevel2 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderByLevel2.vue';
import EpCascaderWithLevel3 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderWithLevel3.vue';
import StaffSelector from '@/components/common/ElementPlusContainners/StaffSelector.vue';
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { EquipmentFilterClass } from '@/assets/js/Class/EquipmentFilterClass';
import { computed } from 'vue';
import { ManageDigitalCompletionTaskList } from '../js/ManageDigitalCompletionTaskList';
import { TaskListConditionCompareEnumList } from '../../ManageTaskListPage/js/EnumList';
import { ManagePageData } from '../js/ManagePageData';

const props = defineProps<{
  ManageTaskListData: ManageDigitalCompletionTaskList
  EquipmentFilterData: Required<EquipmentFilterClass>
  LineList: ManagePageData['LineList']
}>();

const setCondition = (e) => {
  props.ManageTaskListData.condition.setConditon(e);
};

const getList = () => {
  props.ManageTaskListData.getList();
};

const _Operator = computed<string>({
  get() {
    return props.ManageTaskListData.condition.Operator;
  },
  set(val) {
    setCondition([['Operator'], val]);
    getList();
  },
});

const dateList = [
  { name: '近7天订单', ID: 'last7Date' },
  { name: '今天', ID: 'today' },
  { name: '昨天', ID: 'yesterday' },
  { name: '前天', ID: 'beforeyesterday' },
  { name: '本月', ID: 'curMonth' },
  { name: '上月', ID: 'lastMonth' },
];

const UserDefinedTimeIsActive = computed(() => props.ManageTaskListData.condition.DateType === ''
  && !!props.ManageTaskListData.condition.FinishTime.First
  && !!props.ManageTaskListData.condition.FinishTime.Second);

const _Compare = computed({
  get() {
    return props.ManageTaskListData.condition.Compare;
  },
  set(val) {
    setCondition([['Compare'], val]);
    getList();
  },
});

</script>

<style scoped lang='scss'>
.header {
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 18px;
  > div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    > div {
      height: 30px;
      margin-top: 15px;
    }
    .item {
      .title {
        display: inline-block;
        min-width: 5em;
        text-align: right;
        font-weight: 700;
        margin-right: 10px;
        vertical-align: 3px;
      }
    }
  }

  .flexible {
    flex: 1;
  }
}

</style>
