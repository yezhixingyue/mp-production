<template>
  <div class="process-setup-page" >
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
    </header>
    <main>
      <el-scrollbar min-width="1400px">
        <div class="process-setup-page-main">
          <div class="left">
            <el-form :model="Data.processDataFrom" label-width="100px">
              <p class="title">工序设置：</p>
              <el-form-item :label="`工序名称：`" class="form-item-required">
                <el-input v-model="Data.processDataFrom.Name" placeholder="请输入" style="width:270px"></el-input>
              </el-form-item>
              <!-- ReportMode -->
              <el-form-item :label="`报工方式：`" class="form-item-required">
                <el-radio-group v-model="Data.processDataFrom.ReportMode">
                  <el-radio :label="0" :disabled="Data.processDataFrom.Type === 3">按块</el-radio>
                  <el-radio :label="1" :disabled="Data.processDataFrom.Type === 3">按大版</el-radio>
                  <el-radio :label="2" >按订单</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="`工序类型：`" class="form-item-required">
                <div>
                  <el-radio-group v-model="Data.processDataFrom.Type">
                    <el-radio :label="0">普通工序</el-radio>
                    <el-radio :label="1">印刷工序</el-radio>
                    <el-radio :label="2">制版工序</el-radio>
                    <el-radio :label="3" :disabled="Data.processDataFrom.ReportMode !== 2">组合工序</el-radio>
                    <el-radio :label="4" :disabled="Data.processDataFrom.AllowBatchReport">拆分工序</el-radio>
                  </el-radio-group>
                  <div style="height:32px" class="type-conent">
                    <template v-if="Data.processDataFrom.Type === 2">
                      <el-checkbox v-model="Data.processDataFrom.isRestrict" label="限制每套版加工数量" />
                      <span v-if="Data.processDataFrom.isRestrict">
                        每套版最大可加工<el-input v-model.number="Data.processDataFrom.MaxProduceNumber"></el-input>次
                      </span>
                    </template>
                  </div>
                </div>
              </el-form-item>
              <el-form-item :label="`其他：`">
                <div>
                  <el-checkbox @change="() => Data.processDataFrom.AllowBatchReport = false"
                    v-model="Data.processDataFrom.AllowPartReport" label="允许部分报工" />
                  <el-checkbox @change="() => Data.processDataFrom.AllowPartReport = false"
                    v-model="Data.processDataFrom.AllowBatchReport" :disabled="Data.processDataFrom.Type === 4" label="允许批量报工" />
                  <div style="height:32px" class="type-conent">
                    <template v-if="Data.processDataFrom.AllowPartReport">
                      订单数量大于<el-input v-model.number="Data.processDataFrom.MinPartReportNumber"></el-input>时
                    </template>
                  </div>
                </div>
              </el-form-item>
              <p class="title">工序设置：<mp-button type="primary" link @click="selectDeviceGroupShow = true">选择设备组</mp-button> </p>
              <ul class="equipment-groups">
                <el-scrollbar max-height="170px">
                  <li v-for="equipment, index in Data.processDataFrom.EquipmentGroups" :key="equipment.GroupID">
                    <div class="equipment">{{getEquipmentNameByID(equipment.GroupID)}}</div>
                    <div class="state-percent">权重：<el-input v-model="equipment.Weight" placeholder="请输入"></el-input></div>
                    <div class="whether"><el-checkbox v-model="equipment.OneTimeTwoSide" label="可一次印双面" /></div>
                    <div class="del">
                      <mp-button type="info" link @click="EquipmentGroupsRemove(index)"><i class="iconfont icon-delete"></i>删除</mp-button>
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
            </el-form>
          </div>
          <div class="line"></div>
          <div class="right">
            <div>
              <p class="title">需要辅助信息：<mp-button type="primary" link @click="SelectAssistInfoShow = true">选择辅助信息</mp-button><span>（选填）</span></p>
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
              <p class="title">可选物料资源包：<mp-button type="primary" link @click="materialResourceShow = true">选择料资源包</mp-button><span>（选填）</span></p>
              <div class="info">{{showInfoMaterial.map(item => item.Name).join('、')}}</div>
              <p class="title" style="display: flex;">需要大版文件：
                <el-radio-group v-model="Data.processDataFrom.TemplateType" class="min-height-radio">
                  <el-radio :label="0">不需要</el-radio>
                  <el-radio :label="1">印刷版</el-radio>
                  <el-radio :label="2">其他</el-radio>
                </el-radio-group>
              </p>
              <div style="height:32px">
                <template v-if="Data.processDataFrom.TemplateType === 2">
                  <mp-button type="primary" link @click="selectTemplateGroupShow = true">选择大版模板</mp-button>
                  {{showTemplate.map(item => item.Name).join('、')}}
                </template>
              </div>
              <p class="info-text">
                <span class="label">说明：</span>
                <span class="content">此处需要的大版文件指需要传送指定类型的大版文件到此工序，然后才能生产，如果选择多个大版模板，则只需要传送其中一种即可生产。 例如：外协烫印版的制作，需要烫印大版文件；制作PS版，需要印刷大版文件</span>
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
    ReportMode: 0,
    Type: 0,
    MaxProduceNumber: '',
    AllowPartReport: false,
    MinPartReportNumber: '',
    AllowBatchReport: false,
    TemplateType: 0,
    EquipmentGroups: [],
    Relations: [],
  },
});

const BreadcrumbList = computed(() => [
  { to: { path: '/processList' }, name: '工序' },
  {
    name: '添加工序',
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
const saveInfoActive = computed(() => Data.processDataFrom.Relations.filter(item => item.Type === 0).map(res => res.RelationID));
// 物料资源的默认选中
const saveMaterialActive = computed(() => Data.processDataFrom.Relations.filter(item => item.Type === 1).map(res => res.RelationID));
// 显示的辅助信息
const showInfoActive = computed(() => {
  const Infos = Data.processDataFrom.Relations.filter(item => item.Type === 0);
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
            Type: 0,
          }));
        }
      }
    });
    return list;
  };
  returnData.file = getType(0);
  returnData.text = getType(1);
  returnData.number = getType(2);
  return returnData;
});
// 显示的物料资源
const showInfoMaterial = computed(() => {
  const returnData: RelationsType[] = [];
  const temp = Data.processDataFrom.Relations.filter(item => item.Type === 1);
  temp.forEach(item => {
    const Material = productionSettingStore.MaterialTypeGroup.find(it => it.ID === item.RelationID);
    if (Material) {
      returnData.push({
        RelationID: Material.ID,
        Name: Material.Name,
        PID: 0,
        PName: '',
        Type: 1,
      });
    }
  });
  return returnData;
});
// 显示的物料资源
const showTemplate = computed(() => {
  const returnData: RelationsType[] = [];
  const temp = Data.processDataFrom.Relations.filter(item => item.Type === 2);
  temp.forEach(item => {
    const Material = productionSettingStore.ImpositionTemmplateList.find(it => it.ID === item.RelationID);
    if (Material) {
      returnData.push({
        RelationID: Material.ID,
        Name: Material.Name,
        PID: 0,
        PName: '',
        Type: 1,
      });
    }
  });
  return returnData;
});
// 选中的大版文件
const activeTemplateList = computed(() => Data.processDataFrom.Relations.filter(item => item.Type === 2).map(it => it.RelationID));
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
  const elseData = Data.processDataFrom.Relations.filter(res => res.Type !== 2);
  Data.processDataFrom.Relations = [...elseData, ...infoList.map(res => ({
    RelationID: res.ID, Name: res.Name, Type: 2, PID: res.Type,
  }))];
  selectTemplateGroupShow.value = false;
};
const saveInfo = (infoList) => {
  // 去除掉已经选中的数据
  const elseData = Data.processDataFrom.Relations.filter(res => res.Type !== 0);
  Data.processDataFrom.Relations = [...elseData, ...infoList.map(res => ({
    RelationID: res.ID, Name: res.Name, Type: 0, PID: res.Type,
  }))];
  SelectAssistInfoShow.value = false;
};
const saveMaterial = (infoList) => {
  // 去除掉已经选中的数据
  const elseData = Data.processDataFrom.Relations.filter(res => res.Type !== 1);
  Data.processDataFrom.Relations = [...elseData, ...infoList.map(res => ({
    RelationID: res.ID, Name: res.Name, Type: 1, PID: res.MatchType,
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
  } else if (Data.processDataFrom.Type === 2 && Data.processDataFrom.isRestrict && !Data.processDataFrom.MaxProduceNumber) {
    // 弹框提醒
    messageBox.failSingleError('保存失败', '请输入每套版最大可加工数量', () => null, () => null);
  } else if (Data.processDataFrom.AllowPartReport && !Data.processDataFrom.MinPartReportNumber) {
    // 弹框提醒 允许部分报工 最大数量
    messageBox.failSingleError('保存失败', '请输入允许部分报工时最大数量', () => null, () => null);
  } else if (!Data.processDataFrom.EquipmentGroups.length) {
    // 弹框提 请选择设备组
    messageBox.failSingleError('保存失败', '请选择设备组', () => null, () => null);
  } else if (EquipmentGroupsSum.value !== 100) {
    // 弹框提 权重之和不等于100
    messageBox.failSingleError('保存失败', '权重之和不等于100', () => null, () => null);
  } else if (Data.processDataFrom.TemplateType === 2 && !showTemplate.value.length) {
    messageBox.failSingleError('保存失败', '请选择大版模板', () => null, () => null);
    // 弹框提 其他时 大阪模板为空
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
