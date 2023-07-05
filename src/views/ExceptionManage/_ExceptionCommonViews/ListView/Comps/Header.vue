<template>
  <header class="header-box">
    <div class="first">
      <div class="menu">
        <h4>状态筛选：</h4>
        <span v-for="it in localStatusEnumList" :key="it.ID" :class="{active:it.ID===condition.Status}" @click="onMenuClick(it)">{{it.Name}}</span>
      </div>
      <StaffSelector v-model="_Operator" title="处理人" />
    </div>
    <div class="second">
      <div class="left">
        <LineDateSelectorComp
          :changePropsFunc='setCondition'
          :requestFunc='getList'
          :typeList="[['DateType', ''], ['CreateTime', 'First'], ['CreateTime', 'Second']]"
          :dateList="dateList"
          :dateValue='condition.DateType'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          label="时间筛选"
        />
      </div>
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
    </div>
  </header>
</template>

<script setup lang='ts'>
import { ILocalEnumValue } from '@/assets/js/utils/getListByEnums';
import StaffSelector from '@/components/common/ElementPlusContainners/StaffSelector.vue';
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { computed } from 'vue';
import { ConditionForList } from '../../js/ConditionForList';
import { ExceptionHandlerStatusEnumList } from '../../js/EnumList';
import { ITaskExceptionInfo } from '../../js/type';

const props = defineProps<{
  condition: ConditionForList
  setCondition:(e: ISetConditionParams) => void
  clearCondition:() => void
  getList:(Page?: number) => void
  list: ITaskExceptionInfo[]
}>();

const _Operator = computed({
  get() {
    return props.condition.Operator;
  },
  set(val) {
    props.setCondition([['Operator', ''], val]);
    props.getList();
  },
});

const dateList = [
  { name: '近7天异常', ID: 'last7Date' },
  { name: '今天', ID: 'today' },
  { name: '昨天', ID: 'yesterday' },
  { name: '前天', ID: 'beforeyesterday' },
  { name: '本月', ID: 'curMonth' },
  { name: '上月', ID: 'lastMonth' },
];

const UserDefinedTimeIsActive = computed(() => props.condition.DateType === '' && !!props.condition.CreateTime.First && !!props.condition.CreateTime.Second);

const onMenuClick = (it: ILocalEnumValue) => {
  props.setCondition([['Status', ''], it.ID]);
  props.getList();
};

const localStatusEnumList: ILocalEnumValue[] = [{ ID: '', Name: '不限' }, ...ExceptionHandlerStatusEnumList];

</script>

<style scoped lang='scss'>
.header-box {
  padding: 20px 15px 20px;
  .menu {
    flex: none;
    white-space: wrap;
    max-width: 100%;
    min-height: 28px;
    margin-right: 62px;
    > span {
      display: inline-block;
      line-height: 28px;
      padding: 0 17px;
      box-shadow: 0 0 0 1px #e8e8e8;
      cursor: pointer;
      background-color: #f5f5f5;
      color: #444;
      transition: 0.2s ease-in-out;
      position: relative;
      user-select: none;
      &:hover {
        color: #26bcf9;
      }
      &.active {
        color: #26bcf9;
        background-color: #fff;
        box-shadow: 0 0 0 1px #26bcf9;
        z-index: 2;
      }
    }
    .is-pink {
      line-height: 28px;
      i {
        vertical-align: -2px;
      }
    }
    h4 {
      display: inline-block;
      margin-right: 11px;
      min-width: 6em;
      text-align: right;
    }
  }
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
}

</style>
