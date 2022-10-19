<template>
  <div class="process-setup-page" >
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
    </header>
    <main>
    </main>
    <footer>
      <mp-button type="primary" class="gradient" @click="saveProcess">保存</mp-button>
      <mp-button class="blue" @click="$goback">返回</mp-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {
  reactive, onMounted, computed, getCurrentInstance, ref, Ref,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { useRoute } from 'vue-router';
import SelectDeviceGroup from '@/components/productionSetting/selectDeviceGroup.vue';
import SelectAssistInfo from '@/components/productionSetting/selectAssistInfo.vue';
import materialResource from '@/components/productionSetting/materialResource.vue';
import SelectTemplateGroup from '@/components/productionSetting/SelectTemplateGroup.vue';
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

const PasteupSettingStore = usePasteupSettingStore();
const RouterStore = useRouterStore();
const productionSettingStore = useProductionSettingStore();

const route = useRoute();

interface EquipmentGroupsType{
  GroupID: string,
  GroupName: string,
  Weight: number|string,
  OneTimeTwoSide: boolean,
}
interface RelationsType{
  RelationID: string,
  Name?: string,
  PID?: string|number,
  PName?: string,
  Type: number,
}
interface processDataFromType{
  ID: string,
  Name: string
  // 是否限制每套版加工数量 自加字段回显需要添加
  isRestrict: boolean,
  ReportMode: number,
  Type: number,
  MaxProduceNumber: number|string,
  AllowPartReport: boolean,
  MinPartReportNumber: number|string,
  AllowBatchReport: boolean,
  TemplateType: number,
  EquipmentGroups: EquipmentGroupsType[],
  Relations: RelationsType[],
}

const { $goback } = getCurrentInstance()?.appContext.config.globalProperties || { $goback: () => null };

const BreadcrumbList = computed(() => [
  { to: { path: '/productionLine' }, name: '生产线' },
  {
    name: '设备工厂',
  },
]);

function setStorage() { // 设置会话存储
  sessionStorage.setItem('processSetupPage', 'true');
}

const saveProcess = () => {
  // if (Data.processDataFrom.Type === 1 && Data.processDataFrom.isRestrict && !Data.processDataFrom.MaxProduceNumber) {
  //   // 弹框提醒
  //   messageBox.failSingleError('保存失败', '请输入每套版最大可加工数量', () => null, () => null);
  // } else if (Data.processDataFrom.AllowPartReport && !Data.processDataFrom.MinPartReportNumber) {
  //   // 弹框提醒 允许部分报工 最大数量
  //   messageBox.failSingleError('保存失败', '请输入允许部分报工时最大数量', () => null, () => null);
  // } else if (!Data.processDataFrom.EquipmentGroups.length) {
  //   // 弹框提 请选择设备组
  //   messageBox.failSingleError('保存失败', '请选择设备组', () => null, () => null);
  // } else if (EquipmentGroupsSum.value !== 100) {
  //   // 弹框提 权重之和不等于100
  //   messageBox.failSingleError('保存失败', '权重之和不等于100', () => null, () => null);
  // } else if (Data.processDataFrom.TemplateType === 2 && !showTemplate.value.length) {
  //   messageBox.failSingleError('保存失败', '请选择大版模板', () => null, () => null);
  //   // 弹框提 其他时 大阪模板为空
  // } else {
  //   api.getWorkingProcedureSave(Data.processDataFrom).then(res => {
  //     if (res.data.Status === 1000) {
  //       const cb = () => {
  //         setStorage();
  //         RouterStore.goBack();
  //       };
  //       // 保存成功
  //       messageBox.successSingle('保存成功', cb, cb);
  //     }
  //   });
  // }
};
onMounted(() => {
  // sessionStorage.removeItem('foldWayTemplateSteupPage');
  // const temp = JSON.parse(route.params.process as string) as processDataFromType;

  // if (temp) {
  //   // Data.processDataFrom = { ...temp, isRestrict: !!temp.MaxProduceNumber };
  // }
});
</script>
<script lang="ts">
export default {
  name: 'equipmentPage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.process-setup-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  font-size: 12px;
  >header{
    padding: 20px;
    padding-bottom: 0;
  }
  >main{
    flex: 1;
    margin-top: 20px;
    overflow-x: auto;
    padding-left: 20px;
    padding-top: 20px;
    box-sizing: border-box;
    .title{
      font-size: 14px;
      color: #444444;
      font-weight: 600;
      border-left: 3px solid #05C1FF;
      padding-left: 13px;
      line-height: 14px;
      margin-bottom: 36px;
      height: 14px;
      >span{
        font-size: 12px;
        color: #888888;
        font-weight: 400;
      }
    }
    .el-scrollbar__view{
      height: 100%;
    }
    .process-setup-page-main{
      height: 100%;
      display: flex;
      padding-bottom: 70px;
      box-sizing: border-box;
      min-width: 1450px;
      >.left{
        width: 700px;
      }
      >.line{
        // height: 100%;
        width: 1px;
        background-color: #D9D9D9;
        margin: 0 25px;
      }
      >.right{
        min-width: 650px;
        width: 650px;
        .min-height-radio{
          height: 14px;
          line-height: 14px;
          .el-radio{
            height:14px;
          }
        }
        >div{
          >.info{
            margin: -16px 0 36px 8px;
            min-height: 32px;
            line-height: 32px;
          }
        }
      }
    }
    .el-form{
      .el-form-item__content{
        font-size: 12px;
        .type-conent{
          line-height: 32px;
          display: flex;
          .el-checkbox{
            margin-right: 20px;
          }
          .el-input{
            width: 60px;
            margin: 0 10px;
          }
        }
      }
      .equipment-groups{
        margin-bottom: 20px;
        width: 660px;
        li+li{
          margin-top: 25px;
        }
        li{
          display: flex;
          line-height: 32px;
          width: 500px;
          justify-content: flex-end;
          padding-left: 80px;
          >div{
            height: 32px;
            display: flex;
            align-items: center;
            margin-left: 10px;
          }
          div{
          }
          .state-percent{
            .el-input{
              width: 140px;
            }
          }
          .equipment{
            flex: 1;
          }
          .del{
            .iconfont.icon-delete{
              color: $--color-primary;
            }
          }
        }
      }
      .info-text{
        line-height: 32px;
        padding-left: 90px;
        // width: 760px;
        display: flex;
        .label{
          min-width: 60px;
        }
        .content::before{
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #444;
          position: relative;
          top: -2px;
          margin-right: 2px;
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
}
</style>
