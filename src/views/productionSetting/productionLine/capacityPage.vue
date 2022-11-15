<template>
  <div class="put-out-page" >
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
      <div class="header-top">
      </div>
    </header>
    <main>
      <p class="title">
        <span>准备时间：</span>
        <mp-button type="primary" link @click="ToSetup(null, 0)">+ 添加条件</mp-button>
        <span class="hint">仅匹配一条</span>
      </p>
      <ul>
        <li class="item header">
          <div class="content">
            条件
          </div>
          <div class="pot-out">每次作业准备时间</div>
          <div class="priority">优先级</div>
          <div class="ctrl">
            操作
          </div>
        </li>
        <li v-for="(it, i) in setUpTimeDataTableList" :key="it.ID" class="item" :class="{active: activeId === it.ID}">
          <div class="content">
            <i class="index">{{i + 1}}. </i>
            <ConditionTextDisplayComp :conditionObj="it.Constraint" />
          </div>
          <div class="pot-out">{{it.Value}}分钟</div>
          <div class="priority">{{it.Priority}}</div>
          <div class="ctrl">
            <mp-button type="info" class="menu" link @click="ToSetup(it)">
              <i class="iconfont icon-bianji"></i>编辑
            </mp-button>
            <mp-button type="info" class="menu" link @click="onCapacityRemoveClick(it,0, i)">
              <i class="iconfont icon-delete"></i>删除
            </mp-button>
          </div>
        </li>
        <li class="empty" v-if="!setUpTimeDataTableList || setUpTimeDataTableList.length === 0">暂无数据</li>
      </ul>
      <p class="title">
        <span>产能：</span>
        <mp-button type="primary" link @click="ToSetup(null, 1)">+ 添加条件</mp-button>
        <span class="hint">仅匹配一条</span>
      </p>
      <ul>
        <li class="item header">
          <div class="content">
            条件
          </div>
          <div class="pot-out">产能</div>
          <div class="priority">优先级</div>
          <div class="ctrl">
            操作
          </div>
        </li>
        <li v-for="(it, i) in capacityDataTableList" :key="it.ID" class="item" :class="{active: activeId === it.ID}">
          <div class="content">
            <i class="index">{{i + 1}}. </i>
            <ConditionTextDisplayComp :conditionObj="it.Constraint" />
          </div>
          <div class="pot-out">{{it.Value}}/每小时</div>
          <div class="priority">{{it.Priority}}</div>
          <div class="ctrl">
            <mp-button type="info" class="menu" link @click="ToSetup(it)">
              <i class="iconfont icon-bianji"></i>编辑
            </mp-button>
            <mp-button type="info" class="menu" link @click="onCapacityRemoveClick(it,1,i)">
              <i class="iconfont icon-delete"></i>删除
            </mp-button>
          </div>
        </li>
        <li class="empty" v-if="!capacityDataTableList || capacityDataTableList.length === 0">暂无数据</li>
      </ul>
      <p class="title">
        <span>干燥时间：</span>
        <mp-button type="primary" link @click="ToSetup(null, 2)">+ 添加条件</mp-button>
        <span class="hint">仅匹配一条</span>
      </p>
      <ul>
        <li class="item header">
          <div class="content">
            条件
          </div>
          <div class="pot-out">下次作业前干燥时间</div>
          <div class="priority">优先级</div>
          <div class="ctrl">
            操作
          </div>
        </li>
        <li v-for="(it, i) in dryingTimeDataTableList" :key="it.ID" class="item" :class="{active: activeId === it.ID}">
          <div class="content">
            <i class="index">{{i + 1}}. </i>
            <ConditionTextDisplayComp :conditionObj="it.Constraint" />
          </div>
          <div class="pot-out">{{it.Value}}分钟</div>
          <div class="priority">{{it.Priority}}</div>
          <div class="ctrl">
            <mp-button type="info" class="menu" link @click="ToSetup(it)">
              <i class="iconfont icon-bianji"></i>编辑
            </mp-button>
            <mp-button type="info" class="menu" link @click="onCapacityRemoveClick(it,2,i)">
              <i class="iconfont icon-delete"></i>删除
            </mp-button>
          </div>
        </li>
        <li class="empty" v-if="!dryingTimeDataTableList || dryingTimeDataTableList.length === 0">暂无数据</li>
      </ul>
    </main>
    <footer>
      <mp-button class="blue" @click="$goback">返回</mp-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {
  onMounted, computed, getCurrentInstance, ref, Ref, onActivated,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import messageBox from '@/assets/js/utils/message';
import ConditionTextDisplayComp from '@/components/common/ConstraintsComps/ConstraintsTable/ConditionTextDisplayComp.vue';
import { transformConstraintTableList } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { PutOutConditionItemClass } from '@/components/productionSetting/putOut/ConditionSetupPanel/PutOutConditionItemClass';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';

const productionSettingStore = useProductionSettingStore();

const route = useRoute();
const router = useRouter();
const activeId = ref(0);
const { $goback } = getCurrentInstance()?.appContext.config.globalProperties || { $goback: () => null };

const LineEquipmentID = ref('');
const ReportMode = ref();
const CapacityList:Ref<PutOutConditionItemClass[]> = ref([]);

// 准备时间
const setUpTimeData = computed(() => CapacityList.value.filter(it => it.Type === 0));
// 产能
const capacityData = computed(() => CapacityList.value.filter(it => it.Type === 1));
// 干燥时间
const dryingTimeData = computed(() => CapacityList.value.filter(it => it.Type === 2));

const setUpTimeDataTableList = computed(() => transformConstraintTableList({
  tableList: setUpTimeData.value,
  PropertyList: productionSettingStore.PropertyList,
}));
const capacityDataTableList = computed(() => transformConstraintTableList({
  tableList: capacityData.value,
  PropertyList: productionSettingStore.PropertyList,
}));
const dryingTimeDataTableList = computed(() => transformConstraintTableList({
  tableList: dryingTimeData.value,
  PropertyList: productionSettingStore.PropertyList,
}));

const BreadcrumbList = computed(() => [
  { to: { path: '/productionLine' }, name: '生产线' },
  { to: { path: '/equipmentPage' }, name: '生产线' },
  {
    name: '产能',
  },
]);
const getProductionLineCapacityList = () => {
  api.getProductionLineCapacityList(LineEquipmentID.value).then(res => {
    if (res.data.Status === 1000) {
      CapacityList.value = res.data.Data as PutOutConditionItemClass[];
    }
  });
};
const ToSetup = (item, Type?) => {
  router.push({
    name: 'capacitySetup',
    params: {
      LineEquipmentID: LineEquipmentID.value,
      ReportMode: ReportMode.value,
      capacityInfo: JSON.stringify(item),
      Type: item ? item.Type : Type,
    },
  });
};
onActivated(() => {
  const bool = sessionStorage.getItem('capacityPage') === 'true';
  if (bool) {
    getProductionLineCapacityList();
    sessionStorage.removeItem('capacityPage');
  }
});
const onCapacityRemoveClick = (item, Type, i) => {
  let str = '';
  switch (Type) {
    case 0:
      str = '准备时间';
      break;
    case 1:
      str = '产能';
      break;
    case 2:
      str = '干燥时间';
      break;
    default:
      break;
  }
  activeId.value = item.ID;
  messageBox.warnCancelBox('确定要删除此条件吗吗？', `${str}的第${i + 1}个条件`, () => {
    api.getProductionLineCapacityRemove(item.ID).then(res => {
      if (res.data.Status === 1000) {
        activeId.value = 0;
        getProductionLineCapacityList();
      }
    });
  }, () => {
    activeId.value = 0;
  });
};
onMounted(() => {
  sessionStorage.removeItem('capacityPage');
  LineEquipmentID.value = route.params.LineEquipmentID as string;
  ReportMode.value = route.params.ReportMode;
  getProductionLineCapacityList();
  productionSettingStore.getPropertyList({
    UseModule: UseModuleEnum.EquipmentGroupMaterialTypeLimit,
    MaterialTypeList: ['ed2ffb32-dc19-499b-9d3a-af1001115aac', '20cacdac-737d-4ecc-b4a3-af1001116f3c'],
  });
});

</script>
<script lang="ts">
export default {
  name: 'capacityPage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
$row-hover-bg-color: lighten($color: #d8effc, $amount: 6);
$row-hover-border-color: #d6effc;
$row-active-bg-color: lighten($color: #d8effc, $amount: 6);
$row-active-border-color: darken($color: #d8effc, $amount: 15);

.put-out-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  font-size: 12px;
  >header{
    padding: 20px;
    padding-bottom: 0;
    .header-top{
      margin-top: 20px;
    }
  }
  >main{
    flex: 1;
    // margin-top: 20px;
    overflow-x: auto;
    padding-left: 20px;
    // padding-top: 20px;
    box-sizing: border-box;
    > .title{
      font-size: 14px;
      color: #444444;
      font-weight: 600;
      border-left: 3px solid #05C1FF;
      padding-left: 13px;
      line-height: 14px;
      margin: 20px 0;
      height: 16px;
      display: flex;
      align-items: center;
      >span{
        width: 100px;
        &.hint{
        font-size: 12px;
        line-height: 30px;
        color: #F4A307;
        position: relative;
        padding-left: 33px;
        margin-left: 20px;
        &::before{
          content: '';
          background-image: url('@/assets/images/warn.png');
          display: inline-block;
          background-size: 13px 13px;
          width: 13px;
          height: 13px;
          margin: 0 10px;
          position: absolute;
          left: 0;
          top: 8px;
        }
      }
      }
    }
    > ul {
      > li {
        border: 1px solid #eee;
        border-bottom: none;
        line-height: 40px;
        display: flex;
        &.item {
          > .content {
            flex: 1;
            padding: 0 15px;
            font-size: 12px;
            display: flex;
            align-items: center;
            overflow: hidden;
            > .index {
              margin-right: 13px;
            }
          }
          >.pot-out{
            width: 150px;
            text-align: center;
          }
          >.priority{
            width: 150px;
            text-align: center;
          }
          > .ctrl {
            padding-left: 15px;
            width: 220px;
            min-width: 150px;
          }
          transition: 0.1s ease-in-out;
          &:hover {
            cursor: pointer;
            background-color: $row-hover-bg-color;
            border-color: $row-hover-border-color;
            & + li {
              border-top-color: $row-hover-border-color;
            }
            & + li.active {
              border-top-color: $row-active-border-color;
            }
          }
          &.active {
            background-color: $row-active-bg-color;
            border-color: $row-active-border-color;
            & + li {
              border-top-color: $row-active-border-color;
            }
          }
        }
        &.header{
          color: #444;
          font-weight: 700;
          font-size: 14px;
          background-color: #F5F5F5;
          &:hover{
            background-color: #F5F5F5;
          }
          > .content{
            justify-content: center;
            font-size: 14px;
          }
        }
        &:last-of-type {
          border: 1px solid #eee;
        }
        &.empty {
          height: 60px;
          font-size: 12px;
          text-align: center;
          color: #aaa;
          justify-content: center;
          padding-top: 6px;
        }
      }
    }
  }
  >footer{
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 50px;
    .el-button{
      width: 120px;
    }
    .el-button + .el-button{
      margin-left: 30px;
    }
  }
  .add-equipment-dialog{
    .one-list{
      min-height: 350px;
      p{
        font-size: 14px;
        font-weight: 700;
        padding: 10px 0;
      }
      .one{
        padding-left: 1em;
      }
      .tow{
        padding-left: 2em;
      }
      .checkbox{
        padding-left: 3em;
      }
    }
  }
}
</style>
