<template>
  <div class="put-out-page" >
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
      <div class="header-top">
        <mp-button type="primary" @click="ToSetup(null)">+ 添加条件</mp-button>
      </div>
    </header>
    <main>
      <ul>
        <li v-for="(it, i) in localTableList" :key="it.ID" class="item">
          <div class="content">
            <i class="index">{{i + 1}}. </i>
            <ConditionTextDisplayComp :conditionObj="it.Constraint" />
          </div>
          <div class="pot-out">{{it.Value}}{{it.Type === 0 ? '张' : '%'}}</div>
          <div class="priority">{{it.Priority}}</div>
          <div class="ctrl">
            <mp-button type="info" class="menu" link @click="ToSetup(it)">
              <i class="iconfont icon-bianji"></i>编辑
            </mp-button>
            <mp-button type="info" class="menu" link @click="onConditionRemoveClick(it, i)">
              <i class="iconfont icon-delete"></i>删除
            </mp-button>
          </div>
        </li>
        <li class="empty" v-if="!localTableList || localTableList.length === 0">暂无数据</li>
      </ul>
    </main>
    <footer>
      <mp-button class="blue" @click="$goback">返回</mp-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import ConditionTextDisplayComp from '@/components/productionSetting/putOut/ConditionTextDisplayComp.vue';
import {
  reactive, onMounted, computed, getCurrentInstance, ref, Ref, watch,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { useRoute, useRouter } from 'vue-router';
import SelectDeviceGroup from '@/components/productionSetting/selectDeviceGroup.vue';
import SelectAssistInfo from '@/components/productionSetting/selectAssistInfo.vue';
import materialResource from '@/components/productionSetting/materialResource.vue';
import SelectTemplateGroup from '@/components/productionSetting/SelectTemplateGroup.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api';
import type { EquipmentGroups, UseClassEquipmentGroupType } from '@/components/pasteupSetting/types';
import type {
  NotesType, SelectAssistInfoGroup, MaterialTypeGroupsType,
  MaterialTypeGroupType, ProcessListType, ImpositionTemmplateListType, ImpositionTemmplateListGroupType,
} from '@/store/modules/productionSetting/types';
import { useRouterStore } from '@/store/modules/routerStore';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import messageBox from '@/assets/js/utils/message';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import type {
  PutOutType,
} from '@/store/modules/productionSetting/PutOutType';
import ConstraintsTable from '@/components/common/ConstraintsComps/ConstraintsTable/ConstraintsTable.vue';
import { transformConstraintTableList } from '@/components/productionSetting/putOut/utils';
import { ConditionItemClass } from '@/components/productionSetting/putOut/ConditionSetupPanel/ConditionItemClass';

const PasteupSettingStore = usePasteupSettingStore();
const RouterStore = useRouterStore();
const productionSettingStore = useProductionSettingStore();

const route = useRoute();
const router = useRouter();
const { $goback } = getCurrentInstance()?.appContext.config.globalProperties || { $goback: () => null };

const LineEquipmentID = ref('');
const ReportMode = ref();
const PutOutList:Ref<ConditionItemClass[]> = ref([]);

// const localTableList = computed(() => {
//   const returnList:localTableListType[] = [];
//   PutOutList.value.forEach(element => {
//     const msg = '';
//     console.log(element, 'elementelement');

//     returnList.push({ ...element, msg });
//   });
//   return returnList;
// });
const localTableList = computed(() => transformConstraintTableList({
  tableList: PutOutList.value,
  PropertyList: productionSettingStore.PropertyList,
}));

const BreadcrumbList = computed(() => [
  { to: { path: '/productionLine' }, name: '生产线' },
  { to: { path: '/equipmentPage' }, name: '生产线' },
  {
    name: '申放',
  },
]);
const getProductionLinePutOutList = () => {
  api.getProductionLinePutOutList(LineEquipmentID.value).then(res => {
    if (res.data.Status === 1000) {
      PutOutList.value = res.data.Data as ConditionItemClass[];
    }
  });
};
const ToSetup = (item) => {
  router.push({
    name: 'putOutSetup',
    params: {
      LineEquipmentID: LineEquipmentID.value,
      ReportMode: ReportMode.value,
      putOutInfo: JSON.stringify(item),
    },
  });
};
function setStorage() { // 设置会话存储
  sessionStorage.setItem('productionLinePage', 'true');
}

onMounted(() => {
// sessionStorage.removeItem('foldWayTemplateSteupPage');
  LineEquipmentID.value = route.params.LineEquipmentID as string;
  ReportMode.value = route.params.ReportMode;
  getProductionLinePutOutList();
  // productionSettingStore.getPropertyList({ UseModule: 1 });
  productionSettingStore.getPropertyList({
    UseModule: 0,
    MaterialTypeList: ['ed2ffb32-dc19-499b-9d3a-af1001115aac', '20cacdac-737d-4ecc-b4a3-af1001116f3c'],
  });
});

</script>
<script lang="ts">
export default {
  name: 'putOutPage',
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
    margin-top: 20px;
    overflow-x: auto;
    padding-left: 20px;
    // padding-top: 20px;
    box-sizing: border-box;
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
