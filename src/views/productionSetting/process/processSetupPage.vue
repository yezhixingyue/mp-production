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
                    :disabled="Data.processDataFrom.Type === ProcessTypeEnum.combine && it.ID !== ReportModeEnum.order"
                   >{{it.Name}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="`工序类型：`" class="form-item-required">
                <div>
                  <el-radio-group v-model="Data.processDataFrom.Type">
                    <el-radio
                      v-for="it in ProcessTypeEnumList"
                      :key="it.ID"
                      :label="it.ID"
                      :disabled="(it.ID === ProcessTypeEnum.combine && Data.processDataFrom.ReportMode !== ReportModeEnum.order)
                        ||(it.ID === ProcessTypeEnum.split && Data.processDataFrom.AllowBatchReport)"
                     >{{it.Name}}</el-radio>
                  </el-radio-group>
                  <!-- 仅制版工序时显示： 每套版限制加工数量 -->
                  <div class="type-conent" :class="{'v-hide': Data.processDataFrom.Type !== ProcessTypeEnum.platemaking}">
                    <el-checkbox v-model="Data.processDataFrom.isRestrict" label="限制每套版加工数量" />
                    <span v-show="Data.processDataFrom.isRestrict">
                      每套版最大可加工<el-input v-model.number="Data.processDataFrom.MaxProduceNumber" maxlength="9"></el-input>次
                    </span>
                  </div>
                </div>
              </el-form-item>
              <!-- 仅制版工序时显示： 大版类型 -->
              <el-form-item :label="`大版类型：`" :class="{'v-hide': Data.processDataFrom.Type !== ProcessTypeEnum.platemaking}" class="form-item-required">
                <el-radio-group v-model="Data.processDataFrom.TemplateType" class="min-height-radio" style="height: 32px;">
                  <el-radio v-for="it in TemplateTypeEnumList" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
                </el-radio-group>
                <div :class="{'v-hide': Data.processDataFrom.TemplateType !== TemplateTypeEnum.other}" style="width: 100%;">
                  <mp-button type="primary" link @click="selectTemplateGroupShow = true" style="transition: none;">选择大版模板</mp-button>
                  <span class="ml-8" style="position:relative; top:1px;" :title="showTemplate.join('；\r\n')">
                    {{showTemplate.join('；')}}
                  </span>
                </div>
              </el-form-item>
              <el-form-item :label="`其他：`">
                <div>
                  <el-checkbox @change="() => Data.processDataFrom.AllowBatchReport = false"
                    v-model="Data.processDataFrom.AllowPartReport" label="允许部分报工" />
                  <el-checkbox @change="() => Data.processDataFrom.AllowPartReport = false"
                    v-model="Data.processDataFrom.AllowBatchReport" :disabled="Data.processDataFrom.Type === ProcessTypeEnum.split" label="允许批量报工" />
                  <div style="height:32px" class="type-conent">
                    <template v-if="Data.processDataFrom.AllowPartReport">
                      {{getEnumNameByIDAndEnumList(Data.processDataFrom.ReportMode, ReportModeEnumList).replace('报工', '')}}数量大于
                      <el-input v-model.number="Data.processDataFrom.MinPartReportNumber"></el-input>时
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
                  <li v-for="equipment, index in Data.processDataFrom.EquipmentGroups" :key="equipment.GroupID">
                    <div class="equipment" :title="getEquipmentNameByID(equipment.GroupID)">{{getEquipmentNameByID(equipment.GroupID)}}</div>
                    <div class="state-percent">权重：<el-input v-model.trim="equipment.Weight" maxlength="9" placeholder="请输入"></el-input></div>
                    <div class="whether" :class="{hide:Data.processDataFrom.Type!==ProcessTypeEnum.print}">
                      <el-checkbox v-model="equipment.OneTimeTwoSide" label="可一次印双面" />
                    </div>
                    <div class="del">
                      <mp-button type="info" link @click="EquipmentGroupsRemove(index)"><i class="iconfont icon-delete is-pink"></i>删除</mp-button>
                    </div>
                  </li>
                </el-scrollbar>
              </ul>
              <p class="info-text">
                <span class="label">权重说明：</span>
                <span class="content">列表中所有权重之和必须是100，权重越大，越优先分配订单</span>
              </p>
              <p class="info-text">
                <span class="label">具体算法：</span>
                <span class="content">例如有200个订单需要经过A工序进行加工，A工序有3种设备组 x、y、z，权重分别为 x:20；y:20；z:60，则200个订单分配方式为：x:40个订单、y:40个订单、z:120个订单</span>
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
    :saveEquipment="saveMaterial"
    />
    <SelectTemplateGroup
    :visible='selectTemplateGroupShow'
    :changeVisible='(visble) => selectTemplateGroupShow = visble'
    :activeTemplateList="activeTemplateList"
    :TemplateGroup="ImpositionTemmplateListGroup"
    :saveTemplate="saveTemplate"
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
import type { ImpositionTemmplateListGroupType } from '@/store/modules/productionSetting/types';
import { useRouterStore } from '@/store/modules/routerStore';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import messageBox from '@/assets/js/utils/message';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import { AssistInfoTypeEnums } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { getEnumNameByIDAndEnumList } from '@/assets/js/utils/getListByEnums';
import {
  ReportModeEnumList, ReportModeEnum, ProcessTypeEnumList, ProcessTypeEnum, TemplateTypeEnumList, TemplateTypeEnum, WorkingProcedureRelationEnum,
} from './enums';

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
  AllowPartReport: boolean,
  MinPartReportNumber: number|string,
  AllowBatchReport: boolean,
  TemplateType: TemplateTypeEnum,
  EquipmentGroups: EquipmentGroupsType[],
  Relations: RelationsType[],
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
    Type: ProcessTypeEnum.normal,
    MaxProduceNumber: '',
    AllowPartReport: false,
    MinPartReportNumber: '',
    AllowBatchReport: false,
    TemplateType: TemplateTypeEnum.print,
    EquipmentGroups: [],
    Relations: [],
  },
});

const BreadcrumbList = computed(() => [
  { to: { path: '/processList' }, name: '工序' },
  {
    name: `${Data.processDataFrom.ID ? '编辑' : '添加'}工序`,
  },
]);
const ImpositionTemmplateListGroup = computed(() => {
  const returnData:ImpositionTemmplateListGroupType[] = [];
  productionSettingStore.ImpositionTemmplateList.forEach(item => {
    const temp = returnData.find(it => it.ClassID === item.ClassID);
    // 找到此条数据对应的分类及该分类下的所有模板
    if (!temp) {
      const TemmplateClass = PasteupSettingStore.ImpositionTemmplateClassList.find(it => it.ID === item.ClassID);
      const TemmplateList = productionSettingStore.ImpositionTemmplateList.filter(it => it.ClassID === item.ClassID);
      returnData.push({ Name: TemmplateClass?.Name || '', children: TemmplateList, ClassID: TemmplateClass?.ID || 0 });
    }
  });
  return returnData;
});

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
    file:RelationsType[]
    text:RelationsType[]
    number:RelationsType[]
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
    let list:RelationsType[] = [];
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
  const temp = Data.processDataFrom.Relations.filter(item => item.Type === WorkingProcedureRelationEnum.otherBoard);
  const ids = temp.map(it => it.RelationID);
  const list = ImpositionTemmplateListGroup.value.map(it => ({
    Name: it.Name,
    content: it.children.filter(c => ids.includes(c.ID)).map(c => c.Name).join('、'),
  })).filter(it => it.content).map(it => `${it.Name}：${it.content}`);
  return list;
});
// 选中的大版文件
const activeTemplateList = computed(() => Data.processDataFrom.Relations
  .filter(item => item.Type === WorkingProcedureRelationEnum.otherBoard).map(it => it.RelationID));
const activeEquipmentList = computed(() => Data.processDataFrom.EquipmentGroups.map(it => it.GroupID));
const EquipmentGroupsSum = computed(() => {
  let sum = 0;
  Data.processDataFrom.EquipmentGroups.forEach(it => {
    sum += Number(it.Weight);
  });
  if (sum) {
    return sum;
  }
  return 0;
});

function setStorage() { // 设置会话存储
  sessionStorage.setItem('processSetupPage', 'true');
}
const saveEquipment = (Equipments) => {
  Data.processDataFrom.EquipmentGroups = Equipments.map(it => ({
    GroupID: it.ID,
    GroupName: it.Name,
    Weight: '',
    OneTimeTwoSide: false,
  }));
  selectDeviceGroupShow.value = false;
};
const saveTemplate = (infoList) => {
  // 去除掉已经选中的数据
  const elseData = Data.processDataFrom.Relations.filter(res => res.Type !== WorkingProcedureRelationEnum.otherBoard);
  Data.processDataFrom.Relations = [...elseData, ...infoList.map(res => ({
    RelationID: res.ID, Name: res.Name, Type: WorkingProcedureRelationEnum.otherBoard, PID: res.Type,
  }))];
  selectTemplateGroupShow.value = false;
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
  Data.processDataFrom.EquipmentGroups.splice(index, 1);
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
  if (!Data.processDataFrom.Name) {
    // 弹框提醒
    messageBox.failSingleError('保存失败', '请输入工序名称', () => null, () => null);
  } else if (Data.processDataFrom.Type === ProcessTypeEnum.platemaking && Data.processDataFrom.isRestrict
   && !Data.processDataFrom.MaxProduceNumber && Data.processDataFrom.MaxProduceNumber !== 0) {
    // 弹框提醒
    messageBox.failSingleError('保存失败', '请输入每套版最大可加工数量', () => null, () => null);
  } else if (Data.processDataFrom.Type === ProcessTypeEnum.platemaking && Data.processDataFrom.isRestrict
   && !/^[1-9]+[0-9]*$/.test(`${Data.processDataFrom.MaxProduceNumber}`)) {
    // 弹框提醒
    messageBox.failSingleError('保存失败', '每套版最大可加工数量不正确', () => null, () => null);
  } else if (Data.processDataFrom.Type === ProcessTypeEnum.platemaking && Data.processDataFrom.TemplateType === TemplateTypeEnum.other
     && !showTemplate.value.length) {
    messageBox.failSingleError('保存失败', '请选择大版模板', () => null, () => null);
    // 弹框提 其他时 大阪模板为空
  } else if (Data.processDataFrom.AllowPartReport && !Data.processDataFrom.MinPartReportNumber && Data.processDataFrom.MinPartReportNumber !== 0) {
    // 弹框提醒 允许部分报工 最大数量
    messageBox.failSingleError('保存失败', '请输入允许部分报工时最大数量', () => null, () => null);
  } else if (Data.processDataFrom.AllowPartReport && !/^[1-9]+[0-9]*$/.test(`${Data.processDataFrom.MinPartReportNumber}`)) {
    // 弹框提醒 允许部分报工 最大数量
    messageBox.failSingleError('保存失败', '允许部分报工最大数量设置不正确', () => null, () => null);
  } else if (!Data.processDataFrom.EquipmentGroups.length) {
    // 弹框提 请选择设备组
    messageBox.failSingleError('保存失败', '请选择设备组', () => null, () => null);
  } else if (EquipmentGroupsSum.value !== 100) {
    // 弹框提 权重之和不等于100
    messageBox.failSingleError('保存失败', '权重之和不等于100', () => null, () => null);
  } else {
    api.getWorkingProcedureSave(Data.processDataFrom).then(res => {
      if (res.data.Status === 1000) {
        const cb = () => {
          setStorage();
          RouterStore.goBack();
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
    Data.processDataFrom = { ...temp, isRestrict: !!temp.MaxProduceNumber };
  }
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
