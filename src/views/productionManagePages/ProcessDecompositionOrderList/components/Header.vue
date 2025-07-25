<template>
  <header class="header-box">
    <div class="first">
      <EpCascaderByLevel2
         title="生产线"
         showLine
         onlyLastValid
        :fiexdWidth="180"
        @setCondition='setCondition'
        :list='ProductionLineData?.NormalLineList || []'
        :First='condition._ProductionLineType'
        :Second='condition.ProductionLine'
        @getList="getList"
        :typeList="[['_ProductionLineType', ''],['ProductionLine', '']]"
        :defaultProps="{ ID: 'ID', Name: 'Name', children: 'children' }"
        class="mr-20"
      />

      <div style="margin-right: 20px;">
        <span class="filter-title">状态筛选：</span>
        <el-select v-model="_Status" class="mp-select">
          <el-option v-for="item in localStatusEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>

      <StaffSelector v-model="_Operator" title="操作人" />
    </div>
    <div class="second">
      <div class="left">
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
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import StaffSelector from '@/components/common/ElementPlusContainners/StaffSelector.vue';
import EpCascaderByLevel2 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderByLevel2.vue';
import { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { computed } from 'vue';
import { PDOCondition } from '../js/PDOCondition';
import { IPDOrderItem } from '../types/types';
import { PDOStatusEnumList } from '../types/enum';
import { PDOListManageClass } from '../js/PDOListManageClass';

const props = defineProps<{
  condition: PDOCondition
  setCondition:(e: ISetConditionParams) => void
  clearCondition:() => void
  getList:(Page?: number) => void
  list: IPDOrderItem[]
  ProductionLineData: PDOListManageClass['ProductionLineData']
}>();

const _Status = computed({
  get() {
    return props.condition.Status;
  },
  set(val) {
    if (val === props.condition.Status) return;
    props.setCondition([['Status', ''], val]);
    props.getList();
  },
});
const localStatusEnumList = [{ ID: '', Name: '不限' }, ...PDOStatusEnumList];

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
  { name: '近7天下单', ID: 'last7Date' },
  { name: '今天下单', ID: 'today' },
  { name: '昨天下单', ID: 'yesterday' },
  { name: '前天下单', ID: 'beforeyesterday' },
  { name: '本月下单', ID: 'curMonth' },
  // { name: '上月下单', ID: 'lastMonth' },
];
const UserDefinedTimeIsActive = computed(() => props.condition.DateType === '' && !!props.condition.CreateTime.First && !!props.condition.CreateTime.Second);

</script>

<style scoped lang='scss'>
.header-box {
  padding: 20px 15px 20px;
  .first {
    display: flex;
    align-items: center;

    .filter-title {
      margin-right: 10px;
      font-weight: 700;
    }
  }

  .second {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-right: 40px;
  }
  :deep(.mp-line-date-selector-wrap) {
    margin-right: 20px;
    margin-top: 15px;
    line-height: 30px;
    min-width: 750px;
  }
  :deep(.mp-common-comps-search-box) {
    margin-left: 0;
    margin-top: 15px;
    padding-top: 0;
  }
}

</style>
