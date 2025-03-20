<template>
  <header class="header-box">
    <div class="menu">
      <span v-for="it in lineList" :key="it.ID" :class="{active:it.ID===condition.LineID}" @click="onMenuClick(it)">{{it.Name}}</span>
    </div>
    <div class="second">
      <div class="l">
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
        <div class="status">
          <span class="title">状态筛选：</span>
          <el-select v-model="Status" class="mp-select">
            <el-option v-for="item in localPlateStatusEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </div>
        <el-checkbox v-model="checked" class="mt-15">仅显示未拼版</el-checkbox>
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
import { computed } from 'vue';
import { Condition } from '../js/Condition';
import { IManageOrderListItem } from '../js/type';
import { OrderStatusList } from '../js/enum';
import { ManageOrderListClass } from '../js/ManageOrderListClass';

const props = defineProps<{
  setCondition:(e: ISetConditionParams) => void
  getList:(Page?: number) => void
  condition: Condition
  lineList: ManageOrderListClass['ProductionLineList']
  list: IManageOrderListItem[]
}>();

const emit = defineEmits(['clear']);

const dateList = [
  { name: '近7天订单', ID: 'last7Date' },
  { name: '今天下单', ID: 'today' },
  { name: '昨天下单', ID: 'yesterday' },
  { name: '前天下单', ID: 'beforeyesterday' },
  { name: '本月下单', ID: 'curMonth' },
  { name: '上月下单', ID: 'lastMonth' },
];

const UserDefinedTimeIsActive = computed(() => props.condition.DateType === '' && !!props.condition.CreateTime.First && !!props.condition.CreateTime.Second);

const checked = computed({
  get() {
    return props.condition.UnImposition;
  },
  set(val: boolean) {
    if (val === props.condition.UnImposition) return;
    props.setCondition([['UnImposition', ''], val]);
    props.getList();
  },
});

const localPlateStatusEnumList = [{ ID: '', Name: '不限' }, ...OrderStatusList];

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

const clearCondition = () => {
  emit('clear');
};

const onMenuClick = (it: ManageOrderListClass['ProductionLineList'][number]) => {
  props.setCondition([['LineID', ''], it.ID]);
  props.getList();
};

</script>

<style scoped lang='scss'>
.header-box {
  padding: 20px 15px;

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

  .second {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    .l {
      display: flex;
      align-items: center;

      .status {
        position: relative;
        margin-top: 15px;
        top: 2px;
        margin-right: 30px;
        white-space: nowrap;
        .title {
          font-weight: 700;
          margin-right: 10px;
        }
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
}

</style>
