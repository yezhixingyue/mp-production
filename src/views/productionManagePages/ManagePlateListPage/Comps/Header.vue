<template>
  <header class="header-box">
    <div class="menu" v-if="condition.Type === PlateTypeEnum.Plate">
      <span v-for="it in lineList" :key="it.ID" :class="{active:it.ID===condition.LineID}" @click="onMenuClick(it)">{{it.Name}}</span>
    </div>
    <div class="first" v-if="condition.Type === PlateTypeEnum.LaterCraft && WorkingAndMakingGroupList">
      <EpCascaderByLevel2
        title="制版组"
        showLine
        onlyLastValid
        :fiexdWidth="220"
        :First="condition._WorkingID"
        :Second="condition.LineID"
        :type-list="[['_WorkingID', ''], ['LineID', '']]"
        :list="WorkingAndMakingGroupList"
        @getList="(e) => getList(e)"
        @setCondition="(e) => setCondition(e)"
      />
      <div class="status">
        <span class="title">状态筛选：</span>
        <el-select v-model="Status" class="mp-select">
          <el-option v-for="item in localPlateStatusEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>
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
          label="拼版时间"
        />
        <div class="status" v-if="condition.Type === PlateTypeEnum.Plate">
          <span class="title">状态筛选：</span>
          <el-select v-model="Status" class="mp-select">
            <el-option v-for="item in localPlateStatusEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </div>
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
import { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { IListItemType } from '@/components/common/EpCascader/EpCascaderWrap/types';
import { computed, defineAsyncComponent } from 'vue';
import { ProductLineSimpleType } from '../../ManualOrderHandlerPage/js/types';
import { Condition } from '../js/Condition';
import { PlateStatusEnumList } from '../js/EnumList';
import { IManagePlateInfo } from '../js/type';
import { PlateTypeEnum } from '../js/enum';

const EpCascaderByLevel2 = defineAsyncComponent(() => import('@/components/common/EpCascader/EpCascaderWrap/EpCascaderByLevel2.vue'));

const props = defineProps<{
  setCondition:(e: ISetConditionParams) => void
  getList:(Page?: number) => void
  condition: Condition
  list: IManagePlateInfo[]
  lineList: ProductLineSimpleType[]
  WorkingAndMakingGroupList?: IListItemType[]
}>();

const emit = defineEmits(['clear']);

const dateList = [
  { name: '近7天拼版', ID: 'last7Date' },
  { name: '今天拼版', ID: 'today' },
  { name: '昨天拼版', ID: 'yesterday' },
  { name: '前天拼版', ID: 'beforeyesterday' },
  { name: '本月拼版', ID: 'curMonth' },
  { name: '上月拼版', ID: 'lastMonth' },
];

const UserDefinedTimeIsActive = computed(() => props.condition.DateType === '' && !!props.condition.CreateTime.First && !!props.condition.CreateTime.Second);

const clearCondition = () => {
  emit('clear');
};

const onMenuClick = (it: ProductLineSimpleType) => {
  props.setCondition([['LineID', ''], it.ID]);
  props.getList();
};

const localPlateStatusEnumList = [{ ID: '', Name: '不限' }, ...PlateStatusEnumList];

const Status = computed({
  get() {
    return props.condition.Status;
  },
  set(val) {
    if (val === props.condition.Status) return;
    props.setCondition([['Status', ''], val]);
    props.getList();
  },
});

</script>

<style scoped lang='scss'>
.header-box {
  padding: 20px 15px 20px;
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

  .first {
    display: flex;
    align-items: center;

    .status {
      margin-left: 30px;
      margin-top: -4px;
    }
  }
  .second {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .status {
      margin-top: 15px;
    }
  }
  .status {
    position: relative;
    top: 2px;
    .title {
      font-weight: 700;
      margin-right: 10px;
    }
  }
  :deep(.mp-line-date-selector-wrap) {
    margin-right: 20px;
    margin-top: 15px;
    line-height: 30px;
    min-width: 800px;
  }
  :deep(.mp-common-comps-search-box) {
    margin-left: 0;
    margin-top: 15px;
    padding-top: 0;
  }
}

</style>
