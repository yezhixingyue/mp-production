<template>
  <header class="header">
    <div class="menu">
      <span v-for="it in localManageData.DigitalLineList"
       :key="it.ID" :class="{active:it.ID===localManageData.condition.LineID}" @click="onMenuClick(it.ID)">{{it.Name}}</span>
    </div>
    <div class="list">
      <LineDateSelectorComp
        :changePropsFunc='setCondition'
        :requestFunc='getList'
        :isFull="true"
        :typeList="[['DateType', ''], ['CreateTime', 'First'], ['CreateTime', 'Second']]"
        :dateList="dateList"
        :dateValue='localManageData.condition.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        label="同步时间"
        class="mr-20 mt-20"
      />
      <div class="status">
        <span class="title">状态筛选：</span>
        <el-select v-model="Status" class="mp-select">
          <el-option v-for="item in localStatusEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>
      <div class="search mt-20">
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
import { ManageDigitalListClass } from '../js/ManageDigitalListClass';
import { DigitalImpositionStatusEnumList } from '../js/enum';

const props = defineProps<{
  localManageData: ManageDigitalListClass
}>();

const setCondition = (e: ISetConditionParams) => {
  props.localManageData.condition.setConditon(e);
};

const getList = () => {
  props.localManageData.getList();
};

const onMenuClick = (LineID: string) => {
  setCondition([['LineID', ''], LineID]);
  getList();
};

const dateList = [
  { name: '近7天拼版', ID: 'last7Date' },
  { name: '今天拼版', ID: 'today' },
  { name: '昨天拼版', ID: 'yesterday' },
  { name: '前天拼版', ID: 'beforeyesterday' },
  { name: '本月拼版', ID: 'curMonth' },
  { name: '上月拼版', ID: 'lastMonth' },
];

const UserDefinedTimeIsActive = computed(() => props.localManageData.condition.DateType === ''
  && !!props.localManageData.condition.CreateTime.First
  && !!props.localManageData.condition.CreateTime.Second);

const localStatusEnumList = [{ ID: '', Name: '不限' }, ...DigitalImpositionStatusEnumList];

const Status = computed({
  get() {
    return props.localManageData.condition.Status;
  },
  set(val) {
    if (val === props.localManageData.condition.Status) return;
    setCondition([['Status', ''], val]);
    getList();
  },
});

</script>

<style scoped lang='scss'>
.header {
  padding: 20px;
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

  .status {
    margin-top: 20px;
    // position: relative;
    // top: 2px;
    line-height: 32px;
    .title {
      font-weight: 700;
      margin-right: 10px;
    }
  }

  > .list {
    display: flex;
    flex-wrap: wrap;
    padding-right: 20px;

    > * {
      flex: none;
    }

    .search {
      flex: 1 0 auto;
      display: flex;
      justify-content: flex-end;
    }
  }
}

</style>
