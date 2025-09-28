<template>
  <header class="header">
    <div class="menu">
      <span v-for="it in localManageData.CombineLineList"
       :key="it.ID" :class="{active:it.ID===localManageData.condition.Line}" @click="onMenuClick(it.ID)">{{it.Name}}</span>
    </div>
    <div class="list">
      <LineDateSelectorComp
        :changePropsFunc='setCondition'
        :requestFunc='getList'
        :isFull="true"
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        label="时间筛选"
        :menu="{
          radio: localManageData.condition.DateTypeRadio,
          list: [
            {
              label: '创建时间',
              value: 'CreateTimeDateType',
              dateList: dateList,
              dateMenuEnum: localManageData.condition.CreateTimeDateType,
              typeList: [['CreateTimeDateType', ''], ['CreateTime', 'First'], ['CreateTime', 'Second']],
            },
            {
              label: '工期时间',
              value: 'WishFinishTimeDateType',
              dateList: dateList2,
              dateMenuEnum: localManageData.condition.WishFinishTimeDateType,
              typeList: [['WishFinishTimeDateType', ''], ['WishFinishTime', 'First'], ['WishFinishTime', 'Second']],
            },
          ]
        }"
        class="mr-20 mt-15"
      />
      <div class="select-box">
        <span class="title">跟进状态：</span>
        <el-select v-model="HaveTracked" class="mp-select">
          <el-option label="不限" :value="''" />
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
      </div>
      <div class="select-box">
        <span class="title">齐整状态：</span>
        <el-select v-model="HaveReady" class="mp-select">
          <el-option label="不限" :value="''" />
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
      </div>
      <div class="search mt-14">
        <SearchInputComp
          :word='localManageData.condition.KeyWords'
          title="关键词搜索"
          placeholder="请输入搜索关键词"
          resetWords="清空所有筛选条件"
          :changePropsFunc="(keywords: string) => setCondition([['KeyWords', ''], keywords])"
          :requestFunc='getList'
          :searchWatchKey="localManageData.list"
          @reset='() => localManageData.clearCondition()'
        />
      </div>
    </div>
  </header>
</template>

<script setup lang='ts'>
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { computed } from 'vue';
import { TManageCombineTaskPrintListModel } from '../models/ManageCombineTaskPrintListModel';

const props = defineProps<{
  localManageData: TManageCombineTaskPrintListModel
}>();

const setCondition = (e: ISetConditionParams) => {
  props.localManageData.condition.setConditon(e);
};

const getList = () => {
  props.localManageData.getList();
};

const onMenuClick = (LineID: string) => {
  setCondition([['Line', ''], LineID]);
  getList();
};

const dateList = [
  { name: '近7天', ID: 'last7Date' },
  { name: '今天', ID: 'today' },
  { name: '昨天', ID: 'yesterday' },
  { name: '前天', ID: 'beforeyesterday' },
];
const dateList2 = [
  { name: '未来7天', ID: 'next7Date' },
  { name: '今天', ID: 'today' },
  { name: '明天', ID: 'tomorrow' },
  { name: '后天', ID: 'theDayAfterTomorrow' },
];

const UserDefinedTimeIsActive = computed(() => {
  if (props.localManageData.condition.DateTypeRadio === 'CreateTimeDateType') {
    return props.localManageData.condition.CreateTimeDateType === ''
      && !!props.localManageData.condition.CreateTime.First
      && !!props.localManageData.condition.CreateTime.Second;
  }

  return props.localManageData.condition.WishFinishTimeDateType === ''
    && !!props.localManageData.condition.WishFinishTime.First
    && !!props.localManageData.condition.WishFinishTime.Second;
});

const HaveReady = computed({
  get() {
    return props.localManageData.condition.HaveReady;
  },
  set(val) {
    if (val === props.localManageData.condition.HaveReady) return;
    setCondition([['HaveReady', ''], val]);
    getList();
  },
});

const HaveTracked = computed({
  get() {
    return props.localManageData.condition.HaveTracked;
  },
  set(val) {
    if (val === props.localManageData.condition.HaveTracked) return;
    setCondition([['HaveTracked', ''], val]);
    getList();
  },
});

</script>

<style scoped lang='scss'>
.header {
  padding: 20px;
  padding-left: 30px;
  .menu {
    flex: none;
    white-space: wrap;
    max-width: 100%;
    min-height: 28px;
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
  }

  .select-box {
    margin-top: 16px;
    line-height: 32px;
    margin-right: 20px;
    .title {
      font-weight: 700;
      margin-right: 10px;
    }
  }

  > .list {
    display: flex;
    flex-wrap: wrap;
    // padding-right: 20px;

    > * {
      flex: none;
    }

    .search {
      flex: 1 0 auto;
      display: flex;
      justify-content: flex-end;
    }
  }

  :deep(.mp-line-date-selector-wrap) {
    min-width: 618px;
  }
}

</style>
