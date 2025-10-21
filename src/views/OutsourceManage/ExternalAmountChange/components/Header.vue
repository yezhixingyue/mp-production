<template>
  <header class="header-box">
    <div class="row">
      <div class="item">
        <span class="title">外协工厂：</span>
        <el-select v-model="_Factory" class="mp-select" filterable>
          <el-option v-for="item in localPageData.FactoryList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>

      <StaffSelector v-model="_SendOperator" :staffList="localPageData.StaffList" title="外协操作人" />
      <StaffSelector v-model="_Manager" :staffList="localPageData.outsourceManager.list" title="外协主管" />
      <StaffSelector v-model="_RecheckOperator" :staffList="localPageData.RecheckerList.map(it => ({StaffID:it.ID,StaffName:it.Name}))" title="财务复核人" />

      <div class="item">
        <span class="title">复核状态：</span>
        <el-select v-model="_Status" class="mp-select">
          <el-option v-for="item in localStatusEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>
    </div>

    <div class="row second">
      <LineDateSelectorComp
        :changePropsFunc='e => localPageData.listManager.condition.setCondition(e)'
        :requestFunc='() => localPageData.listManager.getList()'
        :typeList="[['DateType', ''], ['SendTime', 'First'], ['SendTime', 'Second']]"
        :dateList="dateList"
        :dateValue='localPageData.listManager.condition.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        label="外协时间"
      />
      <OutsourceManagerButton :outsourceManager="localPageData.outsourceManager" :staffList="localPageData.StaffList" v-if="localPermission?.ManagerSetup" />
    </div>
  </header>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { IUser } from '@/store/modules/user/types';
import StaffSelector from '@/components/common/ElementPlusContainners/StaffSelector.vue';
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { PageMoudleManageClassType } from '../model/PageMoudleManageClass';
import OutsourceManagerButton from './OutsourceManagerButton/OutsourceManagerButton.vue';
import { TaskPriceCheckStatusEnumList } from '../types/enum';

const props = defineProps<{
  localPageData: PageMoudleManageClassType
  localPermission?: IUser['PermissionList']['PermissionTaskChangePrice']['Obj']
}>();

/** 改变条件并重新获取列表 */
const changeConditionAndFetchList = (e: ISetConditionParams) => {
  props.localPageData.listManager.condition.setCondition(e);
  props.localPageData.listManager.getList();
};

const _Factory = computed({
  get() {
    return props.localPageData.listManager.condition.Factory;
  },
  set(val) {
    if (val === props.localPageData.listManager.condition.Factory) return;
    changeConditionAndFetchList([['Factory', ''], val]);
  },
});

const _SendOperator = computed({
  get() {
    return props.localPageData.listManager.condition.SendOperator;
  },
  set(val) {
    changeConditionAndFetchList([['SendOperator', ''], val]);
  },
});

const _Manager = computed({
  get() {
    return props.localPageData.listManager.condition.Manager;
  },
  set(val) {
    changeConditionAndFetchList([['Manager', ''], val]);
  },
});

const _RecheckOperator = computed({
  get() {
    return props.localPageData.listManager.condition.RecheckOperator;
  },
  set(val) {
    changeConditionAndFetchList([['RecheckOperator', ''], val]);
  },
});

const _Status = computed({
  get() {
    return props.localPageData.listManager.condition.Status;
  },
  set(val) {
    if (val === props.localPageData.listManager.condition.Status) return;
    changeConditionAndFetchList([['Status', ''], val]);
  },
});
const localStatusEnumList = computed(() => [{ ID: '', Name: '不限' }, ...TaskPriceCheckStatusEnumList]);

const dateList = [
  { name: '不限', ID: 'all' },
  // { name: '近7天', ID: 'last7Date' },
  { name: '本月', ID: 'curMonth' },
  { name: '今天', ID: 'today' },
  { name: '昨天', ID: 'yesterday' },
  { name: '前天', ID: 'beforeyesterday' },
  { name: '上月', ID: 'lastMonth' },
];
const UserDefinedTimeIsActive = computed(() => props.localPageData.listManager.condition.DateType === ''
 && !!props.localPageData.listManager.condition.SendTime.First && !!props.localPageData.listManager.condition.SendTime.Second);
</script>

<style scoped lang='scss'>
.header-box {
  padding: 20px 15px;
  .row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .item {
      .title {
        min-width: 5em;
        display: inline-block;
        text-align: right;
        margin-right: 10px;
        // margin-top: 15px;
        line-height: 30px;
        font-weight: 700;
      }
      margin-right: 20px
    }

    :deep(.staff-select-wrap) {
      margin-right: 20px;
    }
  }

  .second {
    justify-content: space-between;
    margin-top: 16px;
  }
}
</style>
