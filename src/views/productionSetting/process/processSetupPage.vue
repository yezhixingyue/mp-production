<template>
  <div class="process-setup-page" >
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
    </header>
    <main>
      <el-scrollbar min-width="1400px">
        <div class="process-setup-page-main">
          <div class="left item">
            <el-form :model="Data.processDataFrom" label-width="100px">
              <p class="title">工序设置：</p>
              <el-form-item :label="`工序名称：`" class="form-item-required">
                <el-input v-model.trim="Data.processDataFrom.Name" placeholder="请输入工序名称" style="width:270px" maxlength="15"></el-input>
              </el-form-item>
              <el-form-item :label="`报工方式：`" class="form-item-required">
                <el-radio-group v-model="Data.processDataFrom.ReportMode">
                  <el-radio
                    v-for="it in ReportModeEnumList"
                    :key="it.ID"
                    :label="it.ID"
                    :disabled="Data.processDataFrom.Type === WorkingTypeEnum.combine && it.ID !== ReportModeEnum.order"
                   >{{it.Name}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="`工序类型：`" class="form-item-required">
                <div>
                  <el-radio-group v-model="Data.processDataFrom.Type">
                    <!-- 1. 仅订单报工时可设置为组合工序 -->
                    <!-- 2. 拆分工序不允许批量报工 -->
                    <!-- 3. 制版工序不允许部分报工 -->
                    <el-radio
                      v-for="it in WorkingTypeEnumList"
                      :key="it.ID"
                      :label="it.ID"
                      :disabled="(it.ID === WorkingTypeEnum.combine && Data.processDataFrom.ReportMode !== ReportModeEnum.order)
                        ||(it.ID === WorkingTypeEnum.split && Data.processDataFrom.AllowBatchReport)
                        ||(it.ID === WorkingTypeEnum.platemaking && Data.processDataFrom.AllowPartReport)"
                     >{{it.Name}}</el-radio>
                  </el-radio-group>
                  <!-- 仅制版工序时显示： 每套版限制加工数量 -->
                  <div class="type-conent" :class="{'v-hide': Data.processDataFrom.Type !== WorkingTypeEnum.platemaking}">
                    <el-checkbox v-model="Data.processDataFrom.isRestrict" label="限制每套版加工数量" />
                    <span v-show="Data.processDataFrom.isRestrict">
                      每套版最大可加工<el-input v-model.number="Data.processDataFrom.MaxProduceNumber" maxlength="9"></el-input>次
                    </span>
                  </div>
                </div>
              </el-form-item>
              <!-- 仅制版工序时显示： 大版类型 -->
              <el-form-item :label="`大版类型：`" :class="{'v-hide': Data.processDataFrom.Type !== WorkingTypeEnum.platemaking}" class="form-item-required template">
                <div style="width: 100%;">
                  <mp-button type="primary" link @click="selectTemplateGroupShow = true" style="transition: none;position:relative;top:-1px;">选择大版模板</mp-button>
                  <span class="ml-15" :title="showTemplate"> {{showTemplate}}</span>
                  <!-- 暂不限制！！！ -->
                  <!-- <p style="line-height: 20px;letter-spacing: 1px;">
                    <span class="is-pink" v-show="Data.processDataFrom.ReportMode === ReportModeEnum.board">注：按版报工时仅能选择类型为印刷版或和印刷版保持一致的拼版模板</span>
                    <span class="is-pink" v-show="Data.processDataFrom.ReportMode !== ReportModeEnum.board">注：非按版报工时仅能选择非印刷版且非和印刷版一致的拼版模板</span>
                  </p> -->
                </div>
              </el-form-item>
              <el-form-item :label="`其他：`">
                <div>
                  <el-checkbox @change="() => Data.processDataFrom.AllowBatchReport = false"
                    v-model="Data.processDataFrom.AllowPartReport"
                    :disabled="Data.processDataFrom.Type === WorkingTypeEnum.platemaking || (
                      Data.processDataFrom.EquipmentGroups.length > 0 && Data.processDataFrom.AllowBatchReport
                    )"
                    label="允许部分报工" />
                  <el-checkbox @change="() => Data.processDataFrom.AllowPartReport = false"
                    v-model="Data.processDataFrom.AllowBatchReport"
                    :disabled="Data.processDataFrom.Type === WorkingTypeEnum.split
                     || Data.processDataFrom.EquipmentGroups.length > 0"
                    label="允许批量报工" />
                  <div style="height:32px" class="type-conent">
                    <template v-if="Data.processDataFrom.AllowPartReport">
                      {{getEnumNameByID(Data.processDataFrom.ReportMode, ReportModeEnumList).replace('报工', '')}}数量大于
                      <el-input v-model.number="Data.processDataFrom.MinPartReportNumber" maxlength="9"></el-input>时
                    </template>
                  </div>
                </div>
              </el-form-item>
              <p class="title b" style="margin-top: 28px;"
              >需要辅助信息：<mp-button type="primary" link @click="SelectAssistInfoShow = true">选择辅助信息</mp-button><span>（选填）</span></p>
              <ul class="info">
                <li>
                  <template v-if="showInfoActive.file.length">
                    <span>文件：</span>
                    <span>{{showInfoActive.file.map(res => res.Name).join('、')}}</span>
                  </template>
                </li>
                <li>
                  <template v-if="showInfoActive.text.length">
                    <span>文字信息：</span>
                    <span>{{showInfoActive.text.map(res => res.Name).join('、')}}</span>
                  </template>
                </li>
                <li>
                  <template v-if="showInfoActive.number.length">
                    <span>数字：</span>
                    <span>{{showInfoActive.number.map(res => res.Name).join('、')}}</span>
                  </template>
                </li>
              </ul>
              <p class="title b">可选物料资源包：<mp-button type="primary" link @click="materialResourceShow = true">选择物料资源包</mp-button><span>（选填）</span></p>
              <div class="info">{{showInfoMaterial.join('、')}}</div>
            </el-form>
          </div>
          <div class="line"></div>
          <div class="right item">
            <div>
              <p class="title">设备组：<mp-button type="primary" link @click="selectDeviceGroupShow = true">选择设备组</mp-button> </p>
              <ul class="equipment-groups">
                <el-scrollbar max-height="435px">
                  <li v-for="(equipment, index) in Data.processDataFrom.EquipmentGroups" :key="equipment.GroupID">
                    <div class="equipment" :title="equipment.GroupName">{{equipment.GroupName}}</div>
                    <!-- <div class="state-percent">权重：<el-input v-model.trim="equipment.Weight" maxlength="9" placeholder="请输入"></el-input></div> -->
                    <div class="whether" :class="{hide:Data.processDataFrom.Type!==WorkingTypeEnum.print}">
                      <el-checkbox v-model="equipment.OneTimeTwoSide" label="可一次印双面" />
                    </div>
                    <div class="del">
                      <mp-button type="info" link @click="EquipmentGroupsRemove(index)"><i class="iconfont icon-delete is-pink"></i>删除</mp-button>
                    </div>
                  </li>
                </el-scrollbar>
              </ul>
              <!-- <p class="info-text">
                <span class="label">权重说明：</span>
                <span class="content">列表中所有权重之和必须是100，权重越大，越优先分配订单</span>
              </p>
              <p class="info-text">
                <span class="label">具体算法：</span>
                <span class="content">例如有200个订单需要经过A工序进行加工，A工序有3种设备组 x、y、z，权重分别为 x:20；y:20；z:60，则200个订单分配方式为：x:40个订单、y:40个订单、z:120个订单</span>
              </p> -->
              <p class="info-text">
                <span class="label">操作说明：</span>
                <span class="content">设置过设备组后，左侧 [ 允许批量报工 ] 将不允许修改</span>
              </p>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </main>
    <SelectDeviceGroup
    :visible='selectDeviceGroupShow'
    :changeVisible='(visble) => selectDeviceGroupShow = visble'
    :activeEquipmentList="activeEquipmentList"
    :EquipmentListGroup="productionSettingStore.EquipmentListGroup"
    :saveEquipment="saveEquipment"
    :AllowBatchReport="Data.processDataFrom.AllowBatchReport"
    />
    <!-- 辅助信息 -->
    <SelectAssistInfo
    :visible='SelectAssistInfoShow'
    :changeVisible='(visble) => SelectAssistInfoShow = visble'
    :activeInfoList="saveInfoActive"
    :ListGroup="productionSettingStore.ResourceNoteGroup"
    :saveInfo="saveInfo"
    />
    <!-- 物料资源包 -->
    <materialResource
    :visible='materialResourceShow'
    :changeVisible='(visble) => materialResourceShow = visble'
    :activeMaterialList="saveMaterialActive"
    :MaterialListGroup="productionSettingStore.MaterialTypeGroup"
    :saveMaterial="saveMaterial"
    :initRelations="initRelations"
    />
    <!-- 制版工序 - 选择拼版模板弹窗 - 1.大版时仅能选择印刷版和印刷版一致的大版模板 2.非大版报工时仅能选择非印刷版和非一致的大版模板 - 需传递参数进行区分 -- 暂不限制！！！ -->
    <SelectTemplateGroup
      v-model:visible="selectTemplateGroupShow"
      v-model="Data.processDataFrom.TemplateID"
      :ImpositionTemmplateList="productionSettingStore.ImpositionTemmplateList"
    />
    <footer>
      <mp-button type="primary" class="gradient" @click="saveProcess">保存</mp-button>
      <mp-button class="blue" @click="$goback">返回</mp-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {
  reactive, onMounted, computed, getCurrentInstance, ref,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { useRoute } from 'vue-router';
import SelectDeviceGroup from '@/components/productionSetting/selectDeviceGroup.vue';
import SelectAssistInfo from '@/components/productionSetting/selectAssistInfo.vue';
import materialResource from '@/components/productionSetting/materialResource.vue';
import SelectTemplateGroup from '@/components/productionSetting/SelectTemplateGroup.vue';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useRouterStore } from '@/store/modules/routerStore';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import messageBox from '@/assets/js/utils/message';
import { AssistInfoTypeEnums } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { MakingGroupTypeFeatureEnum } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import {
  ReportModeEnumList, ReportModeEnum, WorkingTypeEnumList, WorkingTypeEnum, WorkingProcedureRelationEnum,
} from './enums';

const RouterStore = useRouterStore();
const productionSettingStore = useProductionSettingStore();

const route = useRoute();

interface IEquipmentGroupsType{
  GroupID: string,
  GroupName: string,
  // Weight: number|string,
  OneTimeTwoSide: boolean,
}
interface IRelationsType{
  RelationID: string,
  Name?: string,
  PID?: string|number,
  PName?: string,
  Type: WorkingProcedureRelationEnum,
}
interface processDataFromType{
  ID: string,
  Name: string
  // 是否限制每套版加工数量 自加字段回显需要添加
  isRestrict: boolean,
  ReportMode: number,
  Type: number,
  MaxProduceNumber: number|string,
  TemplateID: string | null
  AllowPartReport: boolean,
  MinPartReportNumber: number|string,
  AllowBatchReport: boolean,
  EquipmentGroups: IEquipmentGroupsType[],
  Relations: IRelationsType[],
}

interface DataType {
  processDataFrom: processDataFromType,
}
const { $goback } = getCurrentInstance()?.appContext.config.globalProperties || { $goback: () => null };
const selectDeviceGroupShow = ref(false);
const selectTemplateGroupShow = ref(false);
const SelectAssistInfoShow = ref(false);
const materialResourceShow = ref(false);
const Data:DataType = reactive({
  processDataFrom: {
    ID: '',
    Name: '',
    // 是否限制每套版加工数量 自加字段回显需要添加
    isRestrict: false,
    ReportMode: ReportModeEnum.block,
    Type: WorkingTypeEnum.normal,
    MaxProduceNumber: '',
    TemplateID: '',
    AllowPartReport: false,
    MinPartReportNumber: '',
    AllowBatchReport: false,
    EquipmentGroups: [],
    Relations: [],
  },
});

/** 初始选中设备组ID和物料资源包ID */
let initEquipmentGroupIDs: IEquipmentGroupsType['GroupID'][] = [];
const initRelations = ref<IRelationsType[]>([]);

const BreadcrumbList = computed(() => [
  { to: { path: '/processList' }, name: '工序' },
  {
    name: `${Data.processDataFrom.ID ? '编辑' : '添加'}工序`,
  },
]);

// 辅助信息的默认选中
const saveInfoActive = computed(() => Data.processDataFrom.Relations
  .filter(item => item.Type === WorkingProcedureRelationEnum.assets).map(res => res.RelationID));
// 物料资源的默认选中
const saveMaterialActive = computed(() => Data.processDataFrom.Relations
  .filter(item => item.Type === WorkingProcedureRelationEnum.material).map(res => res.RelationID));
// 显示的辅助信息
const showInfoActive = computed(() => {
  const Infos = Data.processDataFrom.Relations.filter(item => item.Type === WorkingProcedureRelationEnum.assets);
  interface returnType {
    file:IRelationsType[]
    text:IRelationsType[]
    number:IRelationsType[]
  }
  const returnData:returnType = {
    // 文件
    file: [],
    // 文字信息
    text: [],
    // 数字
    number: [],
  };
  const getType = (Type) => {
    let list:IRelationsType[] = [];
    productionSettingStore.ResourceNoteGroup.forEach(item => {
      if (item.Type === Type) {
        const temp = item.Notes.filter(res => Infos.find(el => el.RelationID === res.ID));
        if (temp.length) {
          list = temp.map(it => ({
            RelationID: it.ID,
            Name: it.Name,
            PID: Type,
            PName: '',
            Type,
          }));
        }
      }
    });
    return list;
  };
  returnData.file = getType(AssistInfoTypeEnums.file.ID);
  returnData.text = getType(AssistInfoTypeEnums.text.ID);
  returnData.number = getType(AssistInfoTypeEnums.numerical.ID);
  return returnData;
});
// 显示的物料资源
const showInfoMaterial = computed(() => {
  const returnData: string[] = [];
  const temp = Data.processDataFrom.Relations.filter(item => item.Type === WorkingProcedureRelationEnum.material);
  temp.forEach(item => {
    const t = productionSettingStore.MaterialTypeGroup.find(it => it.ID === item.RelationID);
    if (t) {
      returnData.push(t.Name);
    }
  });
  return returnData;
});
// 显示的大版模板文字信息
const showTemplate = computed(() => {
  const t = productionSettingStore.ImpositionTemmplateList.find(it => it.ID === Data.processDataFrom.TemplateID);
  return t?.Name || '';
});

const activeEquipmentList = computed(() => Data.processDataFrom.EquipmentGroups.map(it => it.GroupID));
// const EquipmentGroupsSum = computed(() => {
//   let sum = 0;
//   Data.processDataFrom.EquipmentGroups.forEach(it => {
//     sum += Number(it.Weight);
//   });
//   if (sum) {
//     return sum;
//   }
//   return 0;
// });

function setStorage() { // 设置会话存储
  sessionStorage.setItem('processSetupPage', 'true');
}
const saveEquipment = (Equipments) => {
  Data.processDataFrom.EquipmentGroups = Equipments.map(it => ({
    GroupID: it.ID,
    GroupName: it.Name,
    // Weight: '',
    OneTimeTwoSide: false,
  }));
  selectDeviceGroupShow.value = false;
};
const saveInfo = (infoList) => {
  // 去除掉已经选中的数据
  const elseData = Data.processDataFrom.Relations.filter(res => res.Type !== WorkingProcedureRelationEnum.assets);
  Data.processDataFrom.Relations = [...elseData, ...infoList.map(res => ({
    RelationID: res.ID, Name: res.Name, Type: WorkingProcedureRelationEnum.assets, PID: res.Type,
  }))];
  SelectAssistInfoShow.value = false;
};
const saveMaterial = (infoList) => {
  // 去除掉已经选中的数据
  const elseData = Data.processDataFrom.Relations.filter(res => res.Type !== WorkingProcedureRelationEnum.material);
  Data.processDataFrom.Relations = [...elseData, ...infoList.map(res => ({
    RelationID: res.ID, Name: res.Name, Type: WorkingProcedureRelationEnum.material, PID: res.MatchType,
  }))];

  materialResourceShow.value = false;
};
const EquipmentGroupsRemove = (index) => {
  const target = Data.processDataFrom.EquipmentGroups[index];
  if (!initEquipmentGroupIDs.includes(target.GroupID)) {
    Data.processDataFrom.EquipmentGroups.splice(index, 1);
    return;
  }
  MpMessage.warn({
    title: `确定删除 [ ${target.GroupName} ] 设备组吗?`,
    msg: `<span style="line-height:22px;margin-bottom:15px;display: block;font-size:13px">
      删除该设备组<strong> 且 </strong>在下方保存后将可能会影响到对应<strong>生产线设备/工厂</strong>等数据，请谨慎操作！！
    </span>`,
    onOk() {
      Data.processDataFrom.EquipmentGroups.splice(index, 1);
    },
    dangerouslyUseHTMLString: true,
  });
};
const getEquipmentNameByID = (ID) => {
  let str = '';
  productionSettingStore.EquipmentListGroup.forEach(item => {
    item.EquipmentGroups.forEach(it => {
      if (it.ID === ID) {
        str = it.Name;
      }
    });
  });
  return str;
};
const saveProcess = () => {
  // 检查 如果当前工序类型为制版工序的话 物料资源包中不允许有半成品
  const checkPlatemakingMaterialSource = () => {
    if (Data.processDataFrom.Type === WorkingTypeEnum.platemaking) {
      const list = Data.processDataFrom.Relations.filter(item => item.Type === WorkingProcedureRelationEnum.material);
      if (list.length > 0) {
        const t = list.find(it => {
          const m = productionSettingStore.MaterialTypeGroup.find(_it => _it.ID === it.RelationID);
          return m?.Feature === MakingGroupTypeFeatureEnum.semifinished;
        });
        if (t) return false;
      }
    }
    return true;
  };

  if (!Data.processDataFrom.Name) {
    // 弹框提醒
    messageBox.failSingleError('保存失败', '请输入工序名称', () => null, () => null);
  } else if (Data.processDataFrom.Type === WorkingTypeEnum.platemaking && Data.processDataFrom.isRestrict
   && !Data.processDataFrom.MaxProduceNumber && Data.processDataFrom.MaxProduceNumber !== 0) {
    // 弹框提醒
    messageBox.failSingleError('保存失败', '请输入每套版最大可加工数量', () => null, () => null);
  } else if (Data.processDataFrom.Type === WorkingTypeEnum.platemaking && Data.processDataFrom.isRestrict
   && !/^[1-9]+[0-9]*$/.test(`${Data.processDataFrom.MaxProduceNumber}`)) {
    // 弹框提醒
    messageBox.failSingleError('保存失败', '每套版最大可加工数量不正确', () => null, () => null);
  } else if (Data.processDataFrom.Type === WorkingTypeEnum.platemaking && !Data.processDataFrom.TemplateID) {
    messageBox.failSingleError('保存失败', '请选择大版模板', () => null, () => null);
    // 弹框提 其他时 大阪模板为空
  } else if (!checkPlatemakingMaterialSource()) { // 如果当前工序类型为制版工序的话 物料资源包中不允许有半成品
    messageBox.failSingleError('保存失败', '制版工序物料来源中不允许有半成品', () => null, () => null);
  } else if (Data.processDataFrom.AllowPartReport && !Data.processDataFrom.MinPartReportNumber && Data.processDataFrom.MinPartReportNumber !== 0) {
    // 弹框提醒 允许部分报工 最大数量
    messageBox.failSingleError('保存失败', '请输入允许部分报工时最大数量', () => null, () => null);
  } else if (Data.processDataFrom.AllowPartReport && !/^[1-9]+[0-9]*$/.test(`${Data.processDataFrom.MinPartReportNumber}`)) {
    // 弹框提醒 允许部分报工 最大数量
    messageBox.failSingleError('保存失败', '允许部分报工最大数量设置不正确', () => null, () => null);
  } else if (!Data.processDataFrom.EquipmentGroups.length) {
    // 弹框提 请选择设备组
    messageBox.failSingleError('保存失败', '请选择设备组', () => null, () => null);
  //   else if (EquipmentGroupsSum.value !== 100) {
  //   // 弹框提 权重之和不等于100
  //   messageBox.failSingleError('保存失败', '权重之和不等于100', () => null, () => null);
  // }
  } else {
    const temp = {
      ...Data.processDataFrom,
      MaxProduceNumber: Data.processDataFrom.isRestrict ? Data.processDataFrom.MaxProduceNumber : '',
    };
    api.getWorkingProcedureSave(temp).then(res => {
      if (res.data.Status === 1000) {
        const cb = () => {
          setStorage();
          RouterStore.goBack();
          const curEquipmentGroupIDs = temp.EquipmentGroups.map(it => it.GroupID);
          if (curEquipmentGroupIDs.length !== initEquipmentGroupIDs.length
           || curEquipmentGroupIDs.length !== [...new Set([...curEquipmentGroupIDs, ...initEquipmentGroupIDs])].length) {
            // 设备组有变化 此时应重新获取设备组列表以刷新列表中是否允许批量报工字段的值
            productionSettingStore.getEquipmentGroup();
          }
        };
        // 保存成功
        messageBox.successSingle('保存成功', cb, cb);
      }
    });
  }
};
onMounted(() => {
  // sessionStorage.removeItem('foldWayTemplateSteupPage');
  const temp = JSON.parse(route.params.process as string) as processDataFromType;

  if (temp) {
    Data.processDataFrom = {
      ...temp,
      isRestrict: !!temp.MaxProduceNumber,
      EquipmentGroups: temp.EquipmentGroups.map(it => ({
        ...it,
        GroupName: getEquipmentNameByID(it.GroupID),
      })),
    };
  }
  initEquipmentGroupIDs = Data.processDataFrom.EquipmentGroups.map(it => it.GroupID);
  initRelations.value = [...Data.processDataFrom.Relations];
});
</script>
<script lang="ts">
export default {
  name: 'processSetupPage',
};
</script>
<style lang='scss' scoped>
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
    margin-top: 10px;
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
      margin-bottom: 25px;
      height: 14px;
      margin-top: 8px;
      >span{
        font-size: 12px;
        color: #888888;
        font-weight: 400;
      }
      &.b {
        margin-bottom: 15px;
        margin-top: 18px;
      }
    }
    :deep(.el-scrollbar__view) {
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
        .el-checkbox, .el-radio {
          margin-right: 15px;
        }
        :deep(.el-checkbox__label), :deep(.el-radio__label) {
          display: inline-block;
          min-width: 5em;
        }
      }
      >.line{
        // height: 100%;
        width: 1px;
        background-color: #D9D9D9;
        margin: 0 25px;
      }
      >.item{
        &.right {
          min-width: 650px;
          width: 650px;
        }
        .min-height-radio{
          height: 14px;
          line-height: 14px;
          .el-radio{
            height:14px;
          }
        }
      }
    }
    .el-form{
      .el-form-item__content{
        font-size: 12px;
        .type-conent{
          line-height: 32px;
          height: 34px;
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

      .template {
        margin-top: -10px;
      }
    }
    .equipment-groups{
      margin-bottom: 20px;
      width: 660px;
      li+li{
        margin-top: 15px;
      }
      li{
        display: flex;
        line-height: 32px;
        width: 360px;
        justify-content: flex-end;
        padding-left: 80px;
        overflow: hidden;
        >div{
          height: 32px;
          display: flex;
          align-items: center;
          margin-left: 10px;
        }
        .state-percent{
          .el-input{
            width: 140px;
          }
        }
        .equipment{
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }
        .whether.hide {
          visibility: hidden;
        }
        .del{
          button {
            font-size: 12px;
          }
          .iconfont.icon-delete{
            // color: $--color-primary;
            font-size: 14px;
            position: relative;
            top: -1px;
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
    .info{
      margin: 0px 0 36px 16px;
      line-height: 30px;
    }
    .v-hide {
      visibility: hidden;
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
