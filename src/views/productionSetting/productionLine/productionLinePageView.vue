<template>
  <div class="production-line-page">
    <aside class="right" :class="{'in-preparation': !ProductionLineData}">
      <!-- 下面生产线： -->
      <p class="line-info" v-if="!isCombine">
        <span class="title" :title="actionLine?.Name || ''">
          {{actionLine?.Name || ''}}
          <i v-if="!isCombine && ProductionLineData && ProductionLineData.IsDigital">(数码生产线)</i>
        </span>
        <!-- <span class="fold-the-hand" v-show="actionLine && actionLine.NeedFoldWay">需要折手</span> -->
        <span class="btn" v-if="localPermission?.Setup">
          <EditMenu @click="editLine">编辑</EditMenu>
          <RemoveMenu @click="delLine">删除</RemoveMenu>
        </span>
      </p>

      <mp-button type="primary" v-if="localPermission?.Setup" @click="addPrcess" :disabled="!ProductionLineList.length">+ 添加工序</mp-button>
      <!-- 生产线： -->
      <p class="set-slit" v-if="!isCombine && localPermission?.Setup">
        <mp-button type="primary" link @click="setSplit"><i class="icon-shezhi1 iconfont ft-f-14 scale-14"></i>设置分切工序</mp-button>
      </p>
      <p class="templates" v-if="!isCombine && ProductionLineData && !ProductionLineData.IsDigital">
        <span class="label">允许翻版方式：</span>
        <span class="ft-12">
          {{ProductionLineData.ReproductionTypes?.map(t => getEnumNameByID(t, ReproductionTypeEnumList)).join('、') || '无'}}
        </span>
      </p>
      <p class="templates" v-if="!isCombine && ProductionLineData && !ProductionLineData.IsDigital">
        <span class="label">是否允许按模位：</span>
        <span class="ft-12">
          {{getEnumNameByID(ProductionLineData.UseModeType, LineIsUseModeEnumList)}}
        </span>
      </p>
      <!-- 共用 -->
      <p class="status">
        当前状态：<span :class="ProductionLineData?.Status === LineStatusEnum.usable ? 'is-success' : 'is-pink'"
        >{{ProductionLineData?.Status === LineStatusEnum.usable ? '可用' : '不可用'}}</span>
        <mp-button type="primary" link @click="lineOpen" v-if="localPermission?.Setup"
         v-show="ProductionLineData && ProductionLineData?.Status !== LineStatusEnum.usable">
          <el-icon class="mr-5" style="transform: rotate(90deg)"><Operation /></el-icon>
          设为可用
        </mp-button>
      </p>
    </aside>
    <section>
      <header>
        <div class="classs">
          <RadioGroupComp
            :level1Options='ProductionLineList'
            :level2Options='[]'
            :defaultProps="{
              value:'ID',
              label:'Name',
            }"
            :value='RadioGroupCompValue'
            :useTooltip="false"
            @change="RadioGroupCompChange"
            ></RadioGroupComp>
          <!-- <div class="menu">
            <span v-for="it in ProductionLineList" :key="it.ID" :class="{active:it.ID===Data.getPocessFrom.LineID}" @click="onMenuClick(it)">{{it.Name}}</span>
            <em v-if="ProductionLineList.length === 0" class="is-pink ft-12"><el-icon class="ft-14"><WarningFilled /></el-icon> 暂无生产线!</em>
          </div> -->
          <mp-button type="primary" link @click="AddLine" v-if="localPermission?.Setup">+添加生产线</mp-button>
          <!-- 组合生产线显示内容： -->
          <template v-if="isCombine && ProductionLineList.length > 0 && localPermission?.Setup">
            <mp-button type="primary" link @click="editLine">编辑当前生产线 </mp-button>
            <mp-button type="danger" link @click="delLine">删除当前生产线</mp-button>
          </template>
        </div>
      </header>
      <main>
        <!--  -->
        <div class="left" :class="{'none-split': !(ProductionLineData?.ProductionLineSplitWorking) && localTableList.length}">
          <div class="table-title" >
            <div class="process-item">
              <span class="process">工序</span>
              <span class="equipment">设备/外协工厂</span>
              <!-- <span class="work" v-if="type==='normal'">制版工序</span> -->
              <span class="work">制版工序</span>
              <span class="operate" :class="type">操作</span>
            </div>
          </div>
          <ul v-if="localTableList">
            <LineTableRowComp
              v-for="(it, i) in localTableList"
              :key="(it.WorkID + i)"
              :item="it"
              :type="type"
              :localPermission="localPermission"
              :_summaryWorkList="_summaryWorkList"
              @setPlateMakingWork="setPlateMakingWork"
              @toEquipment="jumpToEquipment"
              @toMaterialSource='jumpToMaterialSource'
              @delLineWorking="delLineWorking"
              @onSplitWorkingRemove="onSplitWorkingRemove"
            />
            <li class="empty" v-if="(localTableList.length === 0)">
              <el-empty></el-empty>
            </li>
          </ul>
          <div class="matters-need-attention">
            <span>注意事项：</span>
            <ul>
              <template v-if="!isCombine">
                <li>在整个生产线工序流程中，仅可以存在一类拆分工序（但可以有多个，例如：裁切、断刀模切），即从大版到单个订单或块的拆分工序。</li>
                <li>其他把大版拆成小版，单个订单切成更小的尺寸，类似这种仅可在拼版时由拼版人员指定并生成裁切稿，此处需要设置一些游离于整个流程之外的拆分工序（信息孤岛），以供拼版人员选择，当然也可以不设置，那么拼版人员就只剩下从大版到单个订单或块的拆分工序可选择了。</li>
                <li>在设为可用状态时，系统会检测工序流程的正确性，即在生产线流程中，拆分工序前必须是按大版报工的工序，之后必须是按订单或按块报工的工序。如果流程中没有折分工序，则整个生产线流程都必须统一，即全部按大版、订单或块来报工。而流程中的拆分工序必须是按大版报工的拆分工序。</li>
                <li>按订单报工的工序下游不能有按块报工的工序，反之则允许。</li>
              </template>
              <template v-else>
                <li class="t">以下两种情况在设为可用状态时系统会提示错误：</li>
                <li>至少需要包含一种组合工序，并且流程首个工序必须是组合工序，其物料来源至少有1个来源自其他生产线；</li>
                <li>所有工序仅可以按订单报工，不能有按大版或块报工的工序；</li>
              </template>
            </ul>
          </div>
        </div>
      </main>
    </section>
    <!-- 此处名称需要按需展示 生产线|组合生产线 -->
    <DialogContainerComp
    :title="`${Data.addLineFrom.ID ? '修改' : '添加'}${isCombine ? '组合' : ''}生产线`"
    :visible='addLineShow'
    :width="700"
    :primaryClick="addLinePrimaryClick"
    :closeClick="addLineCloseClick"
    :closed="addLineCloseedClick"
    >
    <template #default>
      <!-- 生产线与组合生产线有区分 -->
      <div class="add-line-dialog line" style="min-height: 200px;">
        <el-form :model="Data.addLineFrom" label-width="130px">
          <el-form-item label="名称：" class="form-item-required">
            <div class="name">
              <el-input :maxlength="30" v-model="Data.addLineFrom.Name" />
              <!-- <el-checkbox v-if="!isCombine" v-model="Data.addLineFrom.NeedFoldWay" label="需要折手" /> -->
            </div>
          </el-form-item>
          <template v-if="!isCombine">
            <el-checkbox v-model="Data.addLineFrom.IsDigital" :disabled="!!Data.addLineFrom.ID" style="margin: -6px 0 6px 130px;">数码生产线</el-checkbox>
            <template v-if="!Data.addLineFrom.IsDigital">
              <div class="text bold">
                拼版模板设置：
              </div>
              <el-form-item label="允许的翻版方式：" class="form-item-required">
                <el-checkbox-group v-model="Data.addLineFrom.ReproductionTypes">
                  <el-checkbox :label="it.ID" v-for="it in ReproductionTypeEnumList" :key="it.ID">{{it.Name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="是否允许按模位：" class="form-item-required">
                <el-radio-group v-model="Data.addLineFrom.UseModeType">
                  <el-radio :label="it.ID" v-for="it in LineIsUseModeEnumList" :key="it.ID">{{it.Name}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
          </template>
          <template v-else>
            <div class="text bold">
              选择组合工序：
            </div>
            <el-form-item class="form-item-required formatRadioCheckBox">
              <el-checkbox-group v-model="Data.addLineFrom.CombinationWordIDS">
                <el-checkbox :label="it.ID" v-for="it in combinationPrcessList" :disabled="initSelectedCombinationWordIDS.includes(it.ID)"
                 :key="it.ID">{{it.Name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div class="notice">
              <span>注意：</span> 一条组合生产线至少包含一个组合工序
            </div>
          </template>
        </el-form>
      </div>
    </template>
    </DialogContainerComp>
    <DialogContainerComp
      title="添加工序"
      :visible='addPrcessShow'
      :width="660"
      :primaryClick="addPrcessPrimaryClick"
      :closeClick="addPrcessCloseClick"
      :closed="addPrcessCloseedClick"
      top="10vh"
      >
      <template #default>
        <div style="margin-top: -20px;margin-bottom: 25px;">
          <span class="title">工序类型：</span>
          <el-select v-model="Data.addPrcessFrom._filterType" class="mp-select">
            <el-option
              v-for="item in [{ID: '', Name: '不限'}, ...WorkingTypeEnumList]
              .filter(it => ![WorkingTypeEnum.platemaking, WorkingTypeEnum.combine].includes(it.ID as number))"
               :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </div>
        <div class="add-line-dialog mp-pd-line-setup-dialog-content-wrap formatRadioCheckBox">
            <el-checkbox-group v-model="Data.addPrcessFrom.WordIDS">
              <template
               v-for="item in PrcessList.filter(it => !ProductionLineData?.IsDigital || it.ReportMode !== ReportModeEnum.block)
               .filter(it => [it.Type, ''].includes(Data.addPrcessFrom._filterType))"
               :key="item.ClassID"
               >
                <el-checkbox :label="item.ID" :title="item.Name" :disabled="originWordIDS.includes(item.ID)">{{item.Name}}</el-checkbox>
              </template>
            </el-checkbox-group>
            <div v-show="!PrcessList.filter(it => [it.Type, ''].includes(Data.addPrcessFrom._filterType)).length"
               class="ft-12 is-gray" style="text-align: center;">暂无数据</div>
        </div>
      </template>
    </DialogContainerComp>
    <!-- 生产线独有 -->
    <DialogContainerComp
      title="设置分切工序"
      :visible='setSplitShow'
      :width="660"
      :primaryClick="setSplitPrimaryClick"
      :closeClick="setSplitCloseClick"
      :closed="setSplitCloseedClick"
      v-if="!isCombine"
    >
    <template #default>
      <div class="add-line-dialog mp-pd-line-setup-dialog-content-wrap formatRadioCheckBox">
          <el-radio-group v-model="Data.setSplitFrom.SplitWordID">
            <template v-for="item in splitPrcessList" :key="item.ClassID" >
              <el-radio :label="item.ID" :title="item.Name">{{item.Name}}</el-radio>
            </template>
          </el-radio-group>
          <mp-empty v-if="splitPrcessList.length === 0"></mp-empty>
      </div>
    </template>
    </DialogContainerComp>
    <!-- 制版工序设置 -->
    <!-- <PlateMakingWorkSetupDialog v-model:visible="PlateMakingVisible" :curWorkName="curWorkName" @submited="changeLineStatus" v-if="!isCombine" /> -->
    <PlateMakingWorkSetupDialog v-model:visible="PlateMakingVisible" :curWorkName="curWorkName" @submited="changeLineStatus" />
  </div>
</template>

<script lang="ts" setup>
import {
  reactive, ref, Ref, computed, onMounted, onActivated,
} from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import {
  IClassEquipmentGroups, IMaterialSources, IProductionLineWorkings, IWorkingProcedureList,
} from '@/store/modules/productionSetting/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import EditMenu from '@/components/common/menus/EditMenu.vue';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import { FetchWorkingProcedureSearchEnum } from '@/views/productionSetting/js/enums';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { LineStatusEnum, LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { IProductionLineSet } from '@/assets/Types/ProductionLineSet/types';
import { useUserStore } from '@/store/modules/user';
import { getSourceWork } from '../js/utils';
import PlateMakingWorkSetupDialog from './Comps/PlateMakingWorkSetupDialog.vue';
import { IWorkingProcedureSearch } from '../PlateMakingGroupView/js/types';
import { ReportModeEnumList, WorkingTypeEnum, WorkingTypeEnumList, ReportModeEnum } from '../process/enums';
import { ILocalProductionLineWorkings } from './js/types';
import LineTableRowComp from './Comps/LineTableRowComp.vue';
import {
  ReproductionTypeEnum, ReproductionTypeEnumList, LineIsUseModeEnum, LineIsUseModeEnumList,
} from './js/enum';

const props = withDefaults(defineProps<{
  type: 'combine' | 'normal'
}>(), {
  type: 'normal',
});

const isCombine = computed(() => props.type === 'combine');

const userStore = useUserStore();
const localPermission = computed(() => (isCombine.value
  ? userStore.user?.PermissionList.PermissionManageUnionLine.Obj
  : userStore.user?.PermissionList.PermissionManageNormalLine.Obj));

const router = useRouter();
interface getMaxDataType {
    Page: number,
    PageSize: number,
    OnlyShowName: boolean,
}
interface addLineFromType {
    ID: string,
    Name: string,
    Type: number,
    NeedFoldWay: boolean,
    ReproductionTypes: ReproductionTypeEnum[],
    UseModeType: LineIsUseModeEnum | ''
    CombinationWordIDS: string[],
    /** 是否数码生产线 */
    IsDigital: boolean,
}
interface addPrcessFromType {
  ID: string,
  WordIDS: string[],
  _filterType: '' | WorkingTypeEnum
}
interface setSplitFromType {
  ID: string,
  SplitWordID: string,
}
interface getPocessFromType {
  LineID: string,
}
interface DataType {
  getMaxData:getMaxDataType,
  addLineFrom:addLineFromType,
  addPrcessFrom:addPrcessFromType,
  setSplitFrom:setSplitFromType,
  getPocessFrom:getPocessFromType,
}
const productionSettingStore = useProductionSettingStore();
const addLineShow = ref(false);
const addPrcessShow = ref(false);
const setSplitShow = ref(false);
const ProductionLineList:Ref<IProductionLineSet[]> = ref([]);
// 普通工序
const PrcessList:Ref<IWorkingProcedureSearch[]> = ref([]);
// 拆分工序
const splitPrcessList:Ref<IWorkingProcedureSearch[]> = ref([]);
// 组合工序
const combinationPrcessList:Ref<IWorkingProcedureSearch[]> = ref([]);
// 生产线工序列表
const ProductionLineData:Ref<IWorkingProcedureList|null> = ref(null);
const Data:DataType = reactive({
  getMaxData: {
    Page: 1,
    PageSize: 999,
    IsPrintPlate: true,
    OnlyShowName: true,
  },
  addLineFrom: {
    Type: isCombine.value ? LineTypeEnum.combine : LineTypeEnum.normal,
    NeedFoldWay: false,
    CombinationWordIDS: [],
    ID: '',
    Name: '',
    UseModeType: '',
    ReproductionTypes: [],
    IsDigital: false,
  },
  addPrcessFrom: {
    ID: '',
    WordIDS: [],
    _filterType: '',
  },
  setSplitFrom: {
    ID: '',
    SplitWordID: '',
  },
  // 根据生产线获取工序
  getPocessFrom: {
    LineID: '',
  },
});
const RadioGroupCompValue = computed(() => ({
  level1Val: Data.getPocessFrom.LineID,
  level2Val: '',
}));

const _summaryWorkList = computed(() => [...PrcessList.value, ...splitPrcessList.value, ...combinationPrcessList.value]);

// 获取工序名称和报工类型信息
const getWorkingInfo = (item: IProductionLineWorkings) => {
  const t = _summaryWorkList.value.find(it => it.ID === item.WorkID);
  return t ? {
    Name: t.Name,
    ReportModeContent: getEnumNameByID(t.ReportMode, ReportModeEnumList),
    WorkingTypeContent: getEnumNameByID(t.Type, WorkingTypeEnumList),
    WorkItemInfo: t,
  } : null;
};

const { PlateMakingWorkSetupHander } = storeToRefs(productionSettingStore);

// 获取设备文字
const getEquipmentText = (item: IProductionLineWorkings) => {
  const getContent = (ClassEquipmentGroups: IClassEquipmentGroups[]) => {
    const returnStr: string[] = [];
    ClassEquipmentGroups.forEach(ClassIt => {
      ClassIt.EquipmentGroups.forEach(GroupIt => {
        if (GroupIt.Equipments.filter(it => it.LineEquipmentID).map(it => it.Name).length) {
          returnStr.push(`${GroupIt.GroupName}：${GroupIt.Equipments.filter(it => it.LineEquipmentID).map(it => it.Name).join('/')}`);
        }
      });
    });
    return returnStr.join('；');
  };
  let mainContent = getContent(item.ClassEquipmentGroups);
  if (item.PlateMakingClassEquipmentGroups?.length) {
    let plateMakingContent = getContent(item.PlateMakingClassEquipmentGroups);
    if (plateMakingContent) {
      let plateMakingName = '';
      const t = PlateMakingWorkSetupHander.value.PlateMakingWorkAllList.find(it => it.ID === item.PlateMakingWorkID);
      plateMakingName = t ? t.Name : '';
      if (plateMakingName) {
        const mainName = _summaryWorkList.value.find(it => it.ID === item.WorkID)?.Name;
        if (mainName) {
          mainContent = `[ ${mainName} ] ${mainContent}`;
          plateMakingContent = `[ ${plateMakingName} ] ${plateMakingContent}`;
          mainContent = `${mainContent} | ${plateMakingContent}`;
        }
      }
    }
  }
  return mainContent;
};
// 获取物料名
const getMaterialName = (ID) => productionSettingStore.MaterialTypeGroup.find(it => it.ID === ID)?.Name;

const getPlateMakingWorkContent = (item: IProductionLineWorkings) => PlateMakingWorkSetupHander.value.getPlateMakingWorkContent(item);

// 获取物料来源文字
const getMaterialSourcesContent = (MaterialSources: IMaterialSources[]) => {
  if (!MaterialSources || MaterialSources.length === 0) return '';
  const list = MaterialSources.map(it => {
    const name = getMaterialName(it.MaterialTypeID);
    const content = getSourceWork(it, [..._summaryWorkList.value, ...PlateMakingWorkSetupHander.value.PlateMakingWorkAllList]);

    return `${name}：${content}`;
  });
  return list.join('；\r\n');
};

/* 计算后的表格数据
--------------------------------------- */
const localTableList = computed(() => {
  const _list: IProductionLineWorkings[] = [];

  if (ProductionLineData.value?.ProductionLineSplitWorking) {
    _list.push(ProductionLineData.value.ProductionLineSplitWorking);
  }
  if (ProductionLineData.value?.ProductionLineWorkings) {
    _list.push(...ProductionLineData.value.ProductionLineWorkings);
  }

  const list = _list.map((item, i) => {
    const temp = item as ILocalProductionLineWorkings;
    const info = getWorkingInfo(item);
    if (info) {
      temp._WorkName = info.Name;
      temp._ReportModeContent = info.ReportModeContent;
      temp._WorkingTypeContent = info.WorkingTypeContent;
      temp._WorkItemInfo = info.WorkItemInfo;
    }
    temp._EquipmentText = getEquipmentText(item);
    temp._PlateMakingWorkContent = getPlateMakingWorkContent(item);
    temp._isSplit = !!(i === 0 && ProductionLineData.value?.ProductionLineSplitWorking);
    temp._isAfterSplitFirst = !!(i === 1 && ProductionLineData.value?.ProductionLineSplitWorking);
    temp._MaterialSourcesContent = getMaterialSourcesContent(item.MaterialSources);
    temp._PlateMakingMaterialSourcesContent = getMaterialSourcesContent(item.PlateMakingMaterialSources || []);
    return temp;
  });

  return list;
});

// 选中的生产线
const actionLine = computed(() => ProductionLineList.value.find(item => item.ID === Data.getPocessFrom.LineID));
// 跳转物料来源
const jumpToMaterialSource = (item: ILocalProductionLineWorkings) => {
  const name = isCombine.value ? 'combinationMaterialSource' : 'materialSource';
  router.push({
    name,
    params: {
      processInfo: JSON.stringify(item),
      lineData: JSON.stringify(ProductionLineData.value),
      WorkName: item._WorkName,
      lineName: actionLine.value?.Name || '生产线',
    },
  });
};
// 跳转生产设备
const jumpToEquipment = (item: ILocalProductionLineWorkings) => {
  const name = isCombine.value ? 'combinationEquipment' : 'equipment';
  router.push({
    name,
    params: {
      processInfo: JSON.stringify(item),
      WorkName: item._WorkName,
      isSplit: JSON.stringify(item._isSplit),
      lineName: actionLine.value?.Name || '生产线',
    },
  });
};
// 获取生产线工序列表
const getProductionLineWorkingProcedureList = () => {
  api.getProductionLineWorkingProcedureList(Data.getPocessFrom).then(res => {
    if (res.data?.Status === 1000) {
      ProductionLineData.value = res.data.Data as IWorkingProcedureList;
      router.replace({ query: { LineID: Data.getPocessFrom.LineID } });
    }
  });
};
// 删除生产线工序
const delLineWorking = (item: ILocalProductionLineWorkings) => {
  api.getProductionLineWorkingProcedureRemove(item.LineWorkID).then(res => {
    if (res.data?.Status === 1000) {
      MpMessage.success({
        title: '删除成功',
        onOk: getProductionLineWorkingProcedureList,
        onCancel: getProductionLineWorkingProcedureList,
      });
    }
  });
};

const changeLineStatus = () => {
  if (!ProductionLineData.value) return;
  ProductionLineData.value.Status = LineStatusEnum.disabled;
};
// 删除生产线分切工序
const onSplitWorkingRemove = (item: ILocalProductionLineWorkings) => {
  api.getSplitWorkingProcedureRemove(item.LineID).then(res => {
    if (res.data?.Status === 1000) {
      const cb = () => {
        getProductionLineWorkingProcedureList();
        if (actionLine.value) actionLine.value.SplitWordID = '';
      };
      MpMessage.success({
        title: '删除成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  });
};

const RadioGroupCompChange = (levelData) => {
  const { level1Val } = levelData;
  if (level1Val !== undefined) {
    Data.getPocessFrom.LineID = level1Val as string;
    // 获取当前生产线的所有工序();
    ProductionLineData.value = null;
    getProductionLineWorkingProcedureList();
  }
};
// const onMenuClick = (e: IProductionLineSet) => {
//   if (e.ID === Data.getPocessFrom.LineID) return;
//   Data.getPocessFrom.LineID = e.ID;
//   getProductionLineWorkingProcedureList();
// };
// 可用拼版模板显示
// 获取生产线列表
const getProductionLineList = (id?: string) => {
  api.getProductionLineList({ Type: isCombine.value ? LineTypeEnum.combine : LineTypeEnum.normal }).then(res => {
    if (res.data?.Status === 1000) {
      ProductionLineList.value = res.data.Data as IProductionLineSet[];
      // 默认选中第一条生产线
      if (ProductionLineList.value.length) {
        let _id = id;
        if (!_id || !ProductionLineList.value.map(it => it.ID).includes(_id)) {
          _id = ProductionLineList.value[0].ID || '';
        }
        Data.getPocessFrom.LineID = _id;
        getProductionLineWorkingProcedureList();
      }
    }
  });
};
// 获取工序列表
const getPrcessList = () => {
  const type = isCombine.value ? FetchWorkingProcedureSearchEnum.OrderReportNotCombination : FetchWorkingProcedureSearchEnum.NotCombination;
  api.getWorkingProcedureSearch(type).then(res => {
    if (res.data?.Status === 1000) {
      if (!isCombine.value) { // 如果是普通生产线 对工序列表进行筛选 - 筛选掉物料来源中包含半成品的工序
        PrcessList.value = res.data.Data;
      } else {
        PrcessList.value = res.data.Data;
      }
    }
  });
};
// 获取拆分列表
const getsplitPrcessList = () => {
  api.getWorkingProcedureSearch(FetchWorkingProcedureSearchEnum.Split).then(res => {
    if (res.data?.Status === 1000) {
      splitPrcessList.value = res.data.Data;
    }
  });
};
// 获取组合工序列表
const getCombinationPrcessList = () => {
  api.getWorkingProcedureSearch(FetchWorkingProcedureSearchEnum.Combination).then(res => {
    if (res.data?.Status === 1000) {
      combinationPrcessList.value = res.data.Data;
    }
  });
};

// 添加生产线
const AddLine = () => {
  addLineShow.value = true;
};
// 原始WordIDS
const originWordIDS = ref<string[]>([]);
// 添加工序
const addPrcess = () => {
  Data.addPrcessFrom.ID = actionLine.value?.ID || '';
  const _list = ProductionLineData.value?.ProductionLineWorkings || [];
  Data.addPrcessFrom.WordIDS = _list.filter(it => PrcessList.value.find(item => item.ID === it.WorkID) || !isCombine.value).map(it => it.WorkID);
  Data.addPrcessFrom._filterType = '';
  // 格式化已经添加的工序
  originWordIDS.value = [...Data.addPrcessFrom.WordIDS];
  addPrcessShow.value = true;
};
const setSplit = () => {
  Data.setSplitFrom.ID = actionLine.value?.ID || '';
  Data.setSplitFrom.SplitWordID = actionLine.value?.SplitWordID || '';
  // 格式化已经添加的工序
  setSplitShow.value = true;
};
const lineOpen = () => {
  api.getProductionLinOpen(actionLine.value?.ID).then(res => {
    if (res.data?.Status === 1000) {
      const cb = () => {
        getProductionLineList(actionLine.value?.ID);
        // 处理数据变动
      };

      MpMessage.success({
        title: '设置成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  });
};
const initSelectedCombinationWordIDS = ref<string[]>([]);
const editLine = () => {
  if (actionLine.value && ProductionLineData.value) {
    const _list = ProductionLineData.value.ProductionLineWorkings || [];
    const CombinationWordIDS = _list.filter(item => combinationPrcessList.value.find(it => it.ID === item.WorkID)).map(it => it.WorkID);
    // const temp = toRaw(actionLine.value);
    const temp: addLineFromType = {
      ID: actionLine.value.ID,
      Name: actionLine.value.Name,
      Type: actionLine.value.Type,
      NeedFoldWay: actionLine.value.NeedFoldWay,
      ReproductionTypes: ProductionLineData.value.ReproductionTypes ? [...ProductionLineData.value.ReproductionTypes] : [],
      UseModeType: ProductionLineData.value.UseModeType,
      CombinationWordIDS,
      IsDigital: actionLine.value.IsDigital,
    };
    Data.addLineFrom = temp;
    initSelectedCombinationWordIDS.value = CombinationWordIDS;
  }
  addLineShow.value = true;
};
const delLine = () => {
  messageBox.warnCancelBox('确定要删除此生产线吗？', `${actionLine.value?.Name}`, () => {
    api.getProductionLineRemove(actionLine.value?.ID).then(res => {
      if (res.data?.Status === 1000) {
        const cb = () => {
          getProductionLineList();
        };
        // 删除成功
        messageBox.successSingle('删除成功', cb, cb);
      }
    });
  }, () => undefined);
};
const addLineCloseedClick = () => {
  Data.addLineFrom = {
    Type: isCombine.value ? LineTypeEnum.combine : LineTypeEnum.normal,
    NeedFoldWay: false,
    CombinationWordIDS: [],
    ID: '',
    Name: '',
    UseModeType: '',
    ReproductionTypes: [],
    IsDigital: false,
  };
};
const addLineCloseClick = () => {
  addLineShow.value = false;
};
const addLinePrimaryClick = () => {
  if (!Data.addLineFrom.Name) {
    messageBox.failSingleError('保存失败', '请输入生产线名称', () => null, () => null);
    return;
  }
  if (Data.addLineFrom.Type === LineTypeEnum.normal) {
    if (!Data.addLineFrom.IsDigital) {
      if (!Data.addLineFrom.ReproductionTypes || Data.addLineFrom.ReproductionTypes.length === 0) {
        MpMessage.error({ title: '保存失败', msg: '请选择允许翻版方式' });
        return;
      }
      if (Data.addLineFrom.UseModeType === '') {
        MpMessage.error({ title: '保存失败', msg: '请选择是否允许按模位' });
        return;
      }
    }
  } else if (Data.addLineFrom.CombinationWordIDS.length === 0) {
    MpMessage.error({ title: '保存失败', msg: '请选择组合工序' });
    return;
  }
  api.getProductionLineSave(Data.addLineFrom).then(res => {
    if (res.data?.Status === 1000) {
      const cb = () => {
        addLineCloseClick();
        getProductionLineList(Data.addLineFrom.ID);
      };
      // 保存成功
      MpMessage.dialogSuccess('保存成功', cb, cb);
    }
  });
};
// 添加工序
const addPrcessCloseedClick = () => {
  Data.addPrcessFrom = {
    ID: '',
    WordIDS: [],
    _filterType: '',
  };
};
const addPrcessCloseClick = () => {
  addPrcessShow.value = false;
};
const addPrcessPrimaryClick = () => {
  if (!Data.addPrcessFrom.WordIDS.length) {
    messageBox.failSingleError('保存失败', '请选择工序', () => null, () => null);
  } else {
    api.getProductionLineWorkingProcedureAdd(Data.addPrcessFrom).then(res => {
      if (res.data?.Status === 1000) {
        const cb = () => {
          addPrcessCloseClick();
          getProductionLineWorkingProcedureList();
        };
        // 保存成功
        MpMessage.dialogSuccess('保存成功', cb, cb);
      }
    });
  }
};
// 设置分切工序
const setSplitCloseedClick = () => {
  Data.setSplitFrom = {
    ID: '',
    SplitWordID: '',
  };
};
const setSplitCloseClick = () => {
  setSplitShow.value = false;
};
const setSplitPrimaryClick = () => {
  if (!Data.setSplitFrom.SplitWordID) {
    messageBox.failSingleError('保存失败', '请选择分切工序', () => null, () => null);
  } else {
    api.getProductionLineSetSplit(Data.setSplitFrom).then(res => {
      if (res.data?.Status === 1000) {
        const cb = () => {
          const t = ProductionLineList.value.find(it => it.ID === Data.getPocessFrom.LineID);
          if (t) {
            t.SplitWordID = Data.setSplitFrom.SplitWordID;
          }
          setSplitCloseClick();
          getProductionLineWorkingProcedureList();
        };
        // 保存成功
        MpMessage.dialogSuccess('保存成功', cb, cb);
      }
    });
  }
};
// 设置制版工序
const PlateMakingVisible = ref(false);
const curWorkName = ref('');
const setPlateMakingWork = (item: ILocalProductionLineWorkings) => {
  PlateMakingWorkSetupHander.value.setCurWorkItem(item);
  curWorkName.value = item._WorkName || '';
  PlateMakingVisible.value = true;
};

onActivated(() => {
  const sessionKey = props.type === 'normal' ? 'productionLinePage' : 'combinationProductionLinePage';
  const processSetupPage = sessionStorage.getItem(sessionKey) === 'true';
  if (processSetupPage) {
    getProductionLineWorkingProcedureList();
    sessionStorage.removeItem(sessionKey);
  }
});
onMounted(async () => {
  if (isCombine.value) {
    sessionStorage.removeItem('combinationProductionLinePage');
    getCombinationPrcessList();
  } else {
    // if (!PasteupSettingStore.ImpositionTemmplateClassList.length) {
    //   PasteupSettingStore.getImpositionTemmplateClassList();
    // }
    getsplitPrcessList();
    sessionStorage.removeItem('productionLinePage');
  }
  productionSettingStore.setPlateMakingWorkSetupHanderInit();
  getProductionLineList(router.currentRoute.value.query?.LineID as undefined | string);
  // if (!productionSettingStore.MaterialTypeGroup.length) {
  await productionSettingStore.getMaterialTypeGroupAll();
  // }
  getPrcessList();
});
</script>

<style lang='scss'>
@import '@/assets/css/var.scss';
@import '@/assets/css/mixins.scss';

.production-line-page{
  height: 100%;
  display: flex;
  background: #fff;
  > aside {
    background-color: #fff;
    box-sizing: border-box;
    width: 215px;
    padding: 45px 20px;
    padding-left: 22px;
    min-width: 200px;
    box-shadow: 0 0 2px 5px #000;
    flex: none;

    &.in-preparation {
      visibility: hidden;
      opacity: 0;
    }

    .set-slit{
      margin-top: 12px;
      margin-left: -2px;
      padding-bottom: 5px;
      i {
        margin-right: 8px;
      }
    }
    .status{
      margin-top: 2.5em;
      font-size: 14px;
      color: #444;
      font-weight: 700;
      >span{
        // color: #E42A2A;
        margin-left: 10px;
      }
      .el-button{
        font-size: 14px;
        margin-left: -3px;
        margin-top: 5px;
        display: block;
      }
    }
    .line-info{
      margin-bottom: 2.3em;
      font-weight: 700;
      display: flex;
      flex-direction: column;
      .fold-the-hand{
        font-size: 12px;
        color: #888888;
        margin-left: 0.5px;
        margin-top: 1px;
      }
      .title {
        font-size: 15px;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 18px;
        i {
          vertical-align: 1px;
          color: #888;
          font-size: 12px;
          font-weight: 100;
        }
      }
      .btn{
        margin-top: 8px;
        font-weight: 400;
        margin-left: -8px;
        .menu-box + .menu-box {
          margin-left: 30px;
        }
      }
    }
    .templates{
      display: flex;
      flex-direction: column;
      margin-top: 2.5em;
      .label{
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 2px;
      }
    }
  }
  > section {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #fff;
    padding-right: 10px;
    flex: 1;
    overflow-x: hidden;
    > header{
      padding: 20px;
      padding-left: 0;
      background-color: #fff;
      .classs{
        display: flex;
        align-items: flex-start;
        margin-bottom: 10px;
        .el-button{
          height: 30px;
          margin-left: 20px;
        }
        .menu {
          flex: none;
          white-space: wrap;
          max-width: 100%;
          margin-bottom: 20px;
          min-height: 28px;
          > span {
            display: inline-block;
            line-height: 28px;
            padding: 0 17px;
            box-shadow: 0 0 0 1px #e8e8e8;
            cursor: pointer;
            background-color: #f5f5f5;
            color: #444;
            transition: 0.15s ease-in-out;
            position: relative;
            user-select: none;
            &:hover {
              background-color: #eee;
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
      }
    }
    >main{
      flex: 1;
      // margin-top: 10px;
      overflow-x: auto;
      background-color: #fff;
      display: flex;
      >.left{
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        >ul{
          flex: 1;
          overflow: auto;
          overflow: overlay;
          padding-bottom: 1px;
          @include scroll;
          // border-top: 1px solid #D0D0D0;
          // border-bottom: 1px solid #D0D0D0;
          >li{
            >.process-item{
              display: flex;
              font-size: 14px;
              align-items: center;
              // height: 37px;
              line-height: 15px;
              // padding: 0 20px;
              // background-color: #fff;
              .equipment{
                flex: 1;
                white-space: nowrap;
              }
              .process{
                width: 155px;
              }
              .operate{
                // width: 260px;
                width: 340px;
                &.normal {
                  width: 340px;
                }
              }
              .work {
                width: 260px;
                flex-shrink: 1;
                flex-grow: none;
              }
              // border: 1px solid red;
              // border-bottom: 1px dashed #D0D0D0;
            }
            position: relative;
            border-left: 1px solid #D0D0D0;
            border-right: 1px solid #D0D0D0;
          }
          // .table-main:hover{
          //   background-color: #F0F9FE;
          //   background-color: lighten($color: #26bcf9, $amount: 42) !important;
          // }
          .table-main{
            position: relative;
            &::after {
              position: absolute;
              left: 0;
              top: -1px;
              right: 0;
              height: 1px;
              content: '';
              // background-color: #26bfc9;
              border-top: 1px solid rgba(255,255,255,0);
            }
            &:hover {
              // box-shadow: 0 0 0 1px #26bcf9;
              border-color: #26bcf9;
              .material-source {
                border-color: #26bcf9 !important;
              }
              &::after {
                border-color: #26bcf9;
              }
              // >.process-item {
              //   background-color: lighten($color: #26bcf9, $amount: 42);
              // }
              &.split, &.hs {
                border-color: #26bcf9;
                &::after {
                  border-color: rgba(255,255,255,0);
                }
              }
            }
            .process-item{
              height: 45px;
              align-items: center;
              border-top:none;
              padding-top: 6px;
              box-sizing: border-box;
              .process{
                font-weight: 700;
                padding-left: 20px;
              }
              .equipment{
                padding: 0 1em;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                vertical-align: top;
              }
              .operate{
                display: flex;
                padding: 0 2em;
                box-sizing: border-box;
                justify-content: space-between;
              }
              .work {
                padding: 0 1em;
                box-sizing: border-box;
                text-align: center;
                font-weight: 700;
                font-size: 13px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            &.split .process-item {
              padding-top: 0;
            }
            .material-source{
              padding-left: 20px;
              font-size: 12px;
              padding-top: 2px;
              display: flex;
              height: 45px;
              padding-bottom: 2px;
              padding-bottom: 6px;
              color: #888888;
              display: flex;
              opacity: 0.85;
              align-items: center;
              border-bottom: 1px solid rgba(255,255,255,0);
              // background-color: #f8f8f8;
              background-image: linear-gradient(to right, #ddd 100%, rgba(255,255,255,0) 0%); /* 35%设置虚线点x轴上的长度 */
              background-position: top; /* top配置上边框位置的虚线 */
              background-size: 12px 1px; /* 第一个参数设置虚线点的间距；第二个参数设置虚线点y轴上的长度 */
              background-repeat: repeat-x;
              overflow: hidden;
              width: 100%;
              box-sizing: border-box;
              > div {
                flex-shrink: 1;
                display: flex;
                align-items: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                min-width: 20%;
                max-width: 80%;
                p {
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                &:last-of-type {
                  flex: none;
                }
                h4 {
                  font-weight: 400;
                }
              }
              // p+p{
              //   margin-left: 30px;
              // }
              span{
                font-size: 12px;
                line-height: 14px;
              }
            }
            &.split {
              border-top: 1px solid #d0d0d0;
              border-bottom: 1px solid #d0d0d0;
              margin: 10px 0;
              .h {
                visibility: hidden;
              }
            }
            &.hs {
              border-top: 1px solid #d0d0d0;
            }
            &:nth-of-type(even) {
              background-color: #f8f8f8;
            }
            &:last-of-type {
              .material-source {
                border-color: #d0d0d0;
              }
            }
          }
          .empty {
            border-bottom: 1px solid #d0d0d0;
            height: calc(100% - 40px);
            font-size: 12px;
            color: #989898;
            min-height: 420px;
          }
        }
        >.matters-need-attention{
          margin: 12px 0 12px 32px;
          display: flex;
          span{
            min-width: 5em;
          }
          li::before{
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #444;
            position: absolute;
            top: 7px;
            left: 1em;
          }
          li{
            position: relative;
            padding-left: 2em;
            line-height: 1.5em;
            font-size: 12px;
            color: #444;
            &.t {
              font-size: 14px;
              padding-left: 0;
              &::before {
                display: none;
              }
            }
          }
        }
        &.none-split {
          .table-title .process-item {
            border-bottom: none;
          }
          .table-main:first-of-type {
            border-top: 1px solid #d4d4d4;
          }
        }
      }
    }
    >footer{
      min-height: 50px;
      background-color: #fff;
      height: 50px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .add-line-dialog{
    .text{
      font-size: 14px;
      margin-left: 130px;
      margin-bottom: 5px;
    }
    .el-form-item{
      .name{
        flex: 1;
        display: flex;
        padding-right: 40px;
        .el-input{
          margin-right: 32px;
          flex: 1;
        }
      }
    }
    &.line {
      .el-form-item__label {
        font-weight: 700;
        &::before {
          display: none;
        }
      }
      .el-checkbox, .el-radio {
        .el-checkbox__label, .el-radio__label {
          display: inline-block;
          width: 5em;
        }
        &:first-of-type {
          .el-checkbox__label, .el-radio__label {
            width: 3em;
          }
        }
      }
    }
    .notice{
      font-size: 14px;
      text-align: center;
      span{
        font-weight: 700;
      }
    }
  }
}

.table-title{
  background-color: #f5f5f5 !important;
  border-color: #D0D0D0 !important;
  .process-item{
    height: 37px;
    align-items: center;
    background-color: #f5f5f5 !important;
    text-align: center;
    border-top:none;
    font-weight: 700;
    border: 1px solid #D0D0D0;
    background: none;
    display: flex;
    font-size: 14px;
    align-items: center;
    // height: 37px;
    line-height: 15px;
    // padding: 0 20px;
    .equipment{
      flex: 1;
      white-space: nowrap;
    }
    .process{
      width: 175px;
    }
    .operate{
      // width: 260px;
      width: 340px;
      &.normal {
        width: 340px;
      }
    }
    .work {
      width: 260px;
      flex-shrink: 1;
      flex-grow: none;
    }
    .equipment, .process, .work {
      position: relative;
      &::after {
        position: absolute;
        content: '|';
        right: 0;
        color: #e5e5e5;
      }
    }
  }
}

.mp-pd-line-setup-dialog-content-wrap {
  margin-top: -18px;
  min-height: 200px;
  max-height: 500px;
  overflow: auto;
  overflow: overlay;

  @include scroll;
}
.formatRadioCheckBox {
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
  }
  .el-radio, .el-checkbox {
    margin-right: 10px;
    width: calc(33% - 10px);
    display: flex;
    align-items: center;
    height: 28px;
    > .el-radio__input, > .el-checkbox__label {
      flex: none;
    }
    > .el-radio__label, > .el-checkbox__label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
