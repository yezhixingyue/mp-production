<template>
  <header class="header">
    <div>
      <EpCascaderWithLevel3
         title="设备筛选"
        :setCondition='setCondition'
        :levelTreeList='ManageTaskListData.EquipmentFilterData.EquipmentClassAndGroupLevelList'
        :First='ManageTaskListData.condition.Catalog.ClassID'
        :Second='ManageTaskListData.condition.Catalog.GroupID'
        :Third='ManageTaskListData.condition.Catalog.ID'
        :getList="getList"
        :typeList="[['Catalog', 'ClassID'],['Catalog', 'GroupID'],['Catalog', 'ID']]"
        class="mr-20"
      />
      <StaffSelector v-model="_Operator" title="操作人" />
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
        class="mr-20"
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
import EpCascaderWithLevel3 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderWithLevel3.vue';
import StaffSelector from '@/components/common/ElementPlusContainners/StaffSelector.vue';
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import { computed } from 'vue';
import { ManageTaskListClass } from '../js/ManageTaskListClass';
import { TaskListConditionCompareEnumList } from '../js/EnumList';

const props = defineProps<{
  ManageTaskListData: ManageTaskListClass
}>();

const setCondition = (e) => {
  props.ManageTaskListData.condition.setConditon(e);
};

const getList = () => {
  props.ManageTaskListData.getList();
};

const _Operator = computed({
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
}

</style>
