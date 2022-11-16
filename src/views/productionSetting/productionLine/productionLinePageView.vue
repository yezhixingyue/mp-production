<template>
  <div class="production-line-page">
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
          @change="RadioGroupCompChange"
          ></RadioGroupComp>
        <mp-button type="primary" link @click="AddLine">+添加生产线</mp-button>
        <!-- 组合生产线显示内容： -->
        <template v-if="isCombine">
          <mp-button type="primary" link @click="editLine">编辑当前生产线 </mp-button>
          <mp-button type="danger" link @click="delLine">删除当前生产线</mp-button>
        </template>
      </div>
    </header>
    <main>
      <!--  -->
      <div class="left">
        <ul>
          <li class="table-title">
            <div class="process-item">
              <span class="process">工序</span>
              <span class="equipment">设备/外协工厂</span>
              <span class="operate">操作</span>
            </div>
          </li>
          <li class="table-main" v-for="item in ProductionLineData?.ProductionLineWorkings" :key="item.WorkID">
            <div class="process-item">
              <span class="process">{{[...PrcessList,...splitPrcessList, ...combinationPrcessList].find(it => it.ID === item.WorkID)?.Name}}</span>
              <span class="equipment">
                {{getEquipmentText(item)}}
              </span>
              <span class="operate">
                <mp-button type="primary" class="ft-12" link @click="ToEquipment(item)">选择设备/工厂</mp-button>
                <mp-button type="primary" class="ft-12" link :disabled="item.MaterialSources.length===0" @click="ToMaterialSource(item)">物料来源</mp-button>
                <mp-button type="danger" class="ft-12" link @click="delLineWorking(item)">删除</mp-button>
              </span>
            </div>
            <!-- 物料来源 -->
            <div class="material-source" v-if="item.MaterialSources">
              <!-- {{item.MaterialSources}} -->
              <template v-for="material in item.MaterialSources" :key="material.MaterialTypeID">
                <p>{{getMaterialName(material.MaterialTypeID)}}：
                  <span>
                    {{getSourceWork(material, PrcessList)}}
                    <i v-if="!getSourceWork(material, PrcessList)" class="is-gray">来源未设置</i>
                  </span>
                </p>
              </template>
              <p v-if="item.MaterialSources.length === 0">
                <span class="is-gray">暂无物料</span>
              </p>
            </div>
          </li>
        </ul>
        <div class="matters-need-attention">
          <span>注意事项：</span>
          <ul>
            <!-- 生产线： -->
            <template v-if="!isCombine">
              <li>在整个生产线工序流程中，仅可以存在一类拆分工序（但可以有多个，例如：裁切、断刀模切），即从大版到单个订单或块的拆分工序。</li>
              <li>其他把大版拆成小版，单个订单切成更小的尺寸，类似这种仅可在拼版时由拼版人员指定并生成裁切稿，此处需要设置一些游离于整个流程之外的拆分工序（信息孤岛），以供拼版人员选择，当然也可以不设置，那么拼版人员就只剩下从大版到单个订单或块的拆分工序可选择了。</li>
              <li>在设为可用状态时，系统会检测工序流程的正确性，即在生产线流程中，拆分工序前必须是按大版报工的工序，之后必须是按订单或按块报工的工序。如果流程中没有折分工序，则整个生产线流程都必须统一，即全部按大版、订单或块来报工。而流程中的拆分工序必须是按大版报工的拆分工序。</li>
              <li>按订单报工的工序下游不能有按块报工的工序，反之则允许。</li>
            </template>
            <!-- 组合生产线： -->
            <template v-else>
              <li class="t">以下两种情况在设为可用状态时系统会提示错误：</li>
              <li>至少需要包含一种组合工序，并且流程首个工序必须是组合工序，其物料来源至少有1个来源自其他生产线；</li>
              <li>所有工序仅可以按订单报工，不能有按大版或块报工的工序；</li>
            </template>
          </ul>
        </div>
      </div>
      <div class="right">
        <mp-button type="primary" @click="addPrcess" :disabled="!ProductionLineList.length">+ 添加工序</mp-button>
        <!-- 生产线： -->
        <p class="set-slit" v-if="!isCombine">
          <mp-button type="primary" link @click="setSplit"><i class="icon-shezhi1 iconfont ft-f-14 scale-14"></i>设置分切工序</mp-button>
        </p>
        <!-- 共用 -->
        <p class="status">
          当前状态：<span :class="ProductionLineData?.Status === LineStatusEnum.usable ? 'is-success' : 'is-pink'"
          >{{ProductionLineData?.Status === LineStatusEnum.usable ? '可用' : '不可用'}}</span>
          <mp-button type="primary" link @click="lineOpen" v-if="ProductionLineData?.Status !== LineStatusEnum.usable">
            <el-icon class="mr-5" style="transform: rotate(90deg)"><Operation /></el-icon>
            设为可用
          </mp-button>
        </p>
        <!-- 下面生产线： -->
        <p class="line-info" v-if="!isCombine">
          <span>
            {{actionLine?.Name}}<span class="fold-the-hand" v-if="actionLine?.NeedFoldWay">需要折手</span>
          </span>
          <span class="btn">
            <EditMenu @click="editLine">编辑</EditMenu>
            <RemoveMenu @click="delLine">删除</RemoveMenu>
          </span>
        </p>
        <p class="templates" v-if="!isCombine">
          <span class="label">可用拼版模板：</span>
          <span class="ft-12">
            {{getTemplatesName().map(it => it.Name).join('、')}}
          </span>
        </p>
      </div>
    </main>
    <!-- 此处名称需要按需展示 生产线|组合生产线 -->
    <DialogContainerComp
    :title="`${Data.addLineFrom.ID ? '修改' : '添加'}${isCombine ? '组合' : ''}生产线`"
    :visible='addLineShow'
    :width="660"
    :primaryClick="addLinePrimaryClick"
    :closeClick="addLineCloseClick"
    :closed="addLineCloseedClick"
    >
    <template #default>
      <!-- 生产线与组合生产线有区分 -->
      <div class="add-line-dialog line">
        <el-form :model="Data.addLineFrom" label-width="112px">
          <el-form-item label="名称：" class="form-item-required">
            <div class="name">
              <el-input :maxlength="30" v-model="Data.addLineFrom.Name" />
              <el-checkbox v-if="!isCombine" v-model="Data.addLineFrom.NeedFoldWay" label="需要折手" />
            </div>
          </el-form-item>
          <template v-if="!isCombine">
            <div class="text bold">
              可用拼版模板
            </div>
            <el-checkbox-group v-model="Data.addLineFrom.TemplateIDS">
              <el-form-item v-for="item in computedImpositionTemmplate" :key="item.ClassID" class="form-item-required">
                <template #label>
                  <span class="temp-label" :title="item.Name">
                    <em>{{item.Name}}</em>
                    <i>：</i>
                  </span>
                </template>
                <el-checkbox :label="it.ID" v-for="it in item.children" :key="it.ClassID">{{it.Name}}</el-checkbox>
              </el-form-item>
            </el-checkbox-group>
          </template>
          <template v-else>
            <div class="text bold">
              选择组合工序：
            </div>
            <el-form-item class="form-item-required">
              <el-checkbox-group v-model="Data.addLineFrom.CombinationWordIDS">
                <el-checkbox :label="it.ID" v-for="it in combinationPrcessList" :key="it.ID">{{it.Name}}</el-checkbox>
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
    >
    <template #default>
      <div class="add-line-dialog">
          <el-checkbox-group v-model="Data.addPrcessFrom.WordIDS">
            <template v-for="item in PrcessList" :key="item.ClassID" >
              <el-checkbox :label="item.ID">{{item.Name}}</el-checkbox>
            </template>
          </el-checkbox-group>
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
      <div class="add-line-dialog">
          <el-radio-group v-model="Data.setSplitFrom.SplitWordID">
            <template v-for="item in splitPrcessList" :key="item.ClassID" >
              <el-radio :label="item.ID">{{item.Name}}</el-radio>
            </template>
          </el-radio-group>
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang="ts" setup>
import {
  reactive, ref, Ref, computed, onMounted, toRaw, onActivated,
} from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import api from '@/api';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import messageBox from '@/assets/js/utils/message';
import { useRouter } from 'vue-router';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { IWorkingProcedureList } from '@/store/modules/productionSetting/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import EditMenu from '@/components/common/menus/EditMenu.vue';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import { FetchWorkingProcedureSearchEnum, LineStatusEnum, LineTypeEnum } from '@/views/productionSetting/js/enums';
import { getSourceWork } from '../js/utils';

interface ProcessListType {
  ID: string,
  Name: string
}

const props = withDefaults(defineProps<{
  type: 'combine' | 'normal'
}>(), {
  type: 'normal',
});

const isCombine = computed(() => props.type === 'combine');

const router = useRouter();
const PasteupSettingStore = usePasteupSettingStore();
interface ImpositionTemmplateListType {
  ClassID:number,
  ID:string,
  Name:string,
}
interface getMaxDataType {
    Page: number,
    PageSize: number,
    OnlyShowName: boolean,
}
interface addLineFromType {
    Type: number,
    NeedFoldWay: boolean,
    TemplateIDS: string[],
    CombinationWordIDS: string[],
    ID: string,
    Name: string,
}
interface addPrcessFromType {
  ID: string,
  WordIDS: string[],
}
interface setSplitFromType {
  ID: string,
  SplitWordID: string,
}
interface getPocessFromType {
  LineID: string,
}
interface ProductionLineListType {
    SplitWordID: string,
    CreateTime: string,
    Status: number,
    Type: number,
    NeedFoldWay: boolean,
    TemplateIDS: string[],
    CombinationWordIDS: string[],
    ID: string,
    Name: string,
}
interface DataType {
  ImpositionTemmplateList:ImpositionTemmplateListType[],
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
const ProductionLineList:Ref<ProductionLineListType[]> = ref([]);
// 普通工序
const PrcessList:Ref<ProcessListType[]> = ref([]);
// 拆分工序
const splitPrcessList:Ref<ProcessListType[]> = ref([]);
// 组合工序
const combinationPrcessList:Ref<ProcessListType[]> = ref([]);
// 生产线工序列表
const ProductionLineData:Ref<IWorkingProcedureList|null> = ref(null);
const Data:DataType = reactive({
  ImpositionTemmplateList: [],
  getMaxData: {
    Page: 1,
    PageSize: 999,
    OnlyShowName: true,
  },
  addLineFrom: {
    Type: isCombine.value ? LineTypeEnum.combine : LineTypeEnum.normal,
    NeedFoldWay: false,
    TemplateIDS: [],
    CombinationWordIDS: [],
    ID: '',
    Name: '',
  },
  addPrcessFrom: {
    ID: '',
    WordIDS: [],
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
// 选中的生产线
const actionLine = computed(() => ProductionLineList.value.find(item => item.ID === Data.getPocessFrom.LineID));
const computedImpositionTemmplate = computed(() => {
  interface returnDataType {
    ClassID:number,
    Name:string,
    children:ImpositionTemmplateListType[],
  }
  const returnData:returnDataType[] = [];
  Data.ImpositionTemmplateList.forEach(item => {
    const temp = returnData.find(it => it.ClassID === item.ClassID);
    // 找到此条数据对应的分类及该分类下的所有模板
    if (!temp) {
      const TemmplateClass = PasteupSettingStore.ImpositionTemmplateClassList.find(it => it.ID === item.ClassID);
      const TemmplateList = Data.ImpositionTemmplateList.filter(it => it.ClassID === item.ClassID);
      returnData.push({ Name: TemmplateClass?.Name || '', children: TemmplateList, ClassID: TemmplateClass?.ID || 0 });
    }
  });
  return returnData;
});
// 跳转物料来源
const ToMaterialSource = (item) => {
  const name = isCombine.value ? 'combinationMaterialSource' : 'materialSource';
  router.push({
    name,
    params: { processInfo: JSON.stringify(item) },
  });
};
// 跳转生产设备
const ToEquipment = (item) => {
  const name = isCombine.value ? 'combinationEquipment' : 'equipment';
  router.push({
    name,
    params: { processInfo: JSON.stringify(item) },
  });
};
// 获取生产线工序列表
const getProductionLineWorkingProcedureList = () => {
  api.getProductionLineWorkingProcedureList(Data.getPocessFrom).then(res => {
    if (res.data.Status === 1000) {
      ProductionLineData.value = res.data.Data as IWorkingProcedureList;
    }
  });
};
// 删除生产线工序
const delLineWorking = (item) => {
  messageBox.warnCancelBox(
    '确定要删除此工序吗？',
    `${[...PrcessList.value, ...splitPrcessList.value, ...combinationPrcessList.value].find(it => it.ID === item.WorkID)?.Name}`,
    () => {
      api.getProductionLineWorkingProcedureRemove(item.LineWorkID).then(res => {
        if (res.data.Status === 1000) {
          getProductionLineWorkingProcedureList();
        }
      });
    },
  );
};
// 获取设备文字
const getEquipmentText = (item) => {
  let returnStr = '';
  item.ClassEquipmentGroups.forEach(ClassIt => {
    ClassIt.EquipmentGroups.forEach(GroupIt => {
      if (GroupIt.Equipments.filter(it => it.LineEquipmentID).map(it => it.Name).length) {
        returnStr += `${GroupIt.GroupName}：${GroupIt.Equipments.filter(it => it.LineEquipmentID).map(it => it.Name).join('、')}`;
      }
    });
  });
  return returnStr;
};
// 获取物料名
const getMaterialName = (ID) => productionSettingStore.MaterialTypeGroup.find(it => it.ID === ID)?.Name;

const RadioGroupCompChange = (levelData) => {
  const { level1Val } = levelData;
  if (level1Val !== undefined) {
    Data.getPocessFrom.LineID = level1Val as string;
    // 获取当前生产线的所有工序();
    getProductionLineWorkingProcedureList();
  }
};
// 可用拼版模板显示
const getTemplatesName = () => {
  const returnData:ImpositionTemmplateListType[] = [];
  if (!ProductionLineData.value?.TemplateIDS) return [];
  ProductionLineData.value.TemplateIDS.forEach(item => {
    const temp = Data.ImpositionTemmplateList.find(it => it.ID === item);
    if (temp) {
      returnData.push(temp);
    }
  });
  return returnData;
};
// 获取生产线列表
const getProductionLineList = () => {
  api.getProductionLineList({ Type: isCombine.value ? LineTypeEnum.combine : LineTypeEnum.normal }).then(res => {
    if (res.data.Status === 1000) {
      ProductionLineList.value = res.data.Data as ProductionLineListType[];
      // 默认选中第一条生产线
      if (ProductionLineList.value.length) {
        Data.getPocessFrom.LineID = ProductionLineList.value[0].ID || '';
        getProductionLineWorkingProcedureList();
      }
    }
  });
};
// 获取工序列表
const getPrcessList = () => {
  const type = isCombine.value ? FetchWorkingProcedureSearchEnum.OrderReportNotCombination : FetchWorkingProcedureSearchEnum.NotCombination;
  api.getWorkingProcedureSearch(type).then(res => {
    if (res.data.Status === 1000) {
      PrcessList.value = res.data.Data as ProcessListType[];
    }
  });
};
// 获取拆分列表
const getsplitPrcessList = () => {
  api.getWorkingProcedureSearch(FetchWorkingProcedureSearchEnum.Split).then(res => {
    if (res.data.Status === 1000) {
      splitPrcessList.value = res.data.Data as ProcessListType[];
    }
  });
};
// 获取组合工序列表
const getCombinationPrcessList = () => {
  api.getWorkingProcedureSearch(0).then(res => {
    if (res.data.Status === 1000) {
      combinationPrcessList.value = res.data.Data as ProcessListType[];
    }
  });
};
// 获取拼版模板列表
function getImpositionTemmplateList() {
  api.getImpositionTemmplateList(Data.getMaxData).then(res => {
    if (res.data.Status === 1000) {
      Data.ImpositionTemmplateList = res.data.Data as ImpositionTemmplateListType[];
    }
  });
}
// 添加生产线
const AddLine = () => {
  addLineShow.value = true;
};
// 添加工序
const addPrcess = () => {
  Data.addPrcessFrom.ID = actionLine.value?.ID || '';
  const _list = ProductionLineData.value?.ProductionLineWorkings || [];
  Data.addPrcessFrom.WordIDS = _list.filter(it => PrcessList.value.find(item => item.ID === it.WorkID) || !isCombine.value).map(it => it.WorkID);
  // 格式化已经添加的工序
  addPrcessShow.value = true;
};
const setSplit = () => {
  if (actionLine.value?.SplitWordID) {
    Data.setSplitFrom.SplitWordID = actionLine.value?.SplitWordID;
  } else {
    Data.setSplitFrom.SplitWordID = '';
  }
  Data.setSplitFrom.ID = actionLine.value?.ID || '';
  // 格式化已经添加的工序
  setSplitShow.value = true;
};
const lineOpen = () => {
  api.getProductionLinOpen(actionLine.value?.ID).then(res => {
    if (res.data.Status === 1000) {
      const cb = () => {
        getProductionLineList();
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
const editLine = () => {
  if (actionLine.value) {
    const _list = ProductionLineData.value?.ProductionLineWorkings || [];
    const CombinationWordIDS = _list.filter(item => combinationPrcessList.value.find(it => it.ID === item.WorkID)).map(it => it.WorkID);
    const temp = toRaw(actionLine.value);
    temp.TemplateIDS = ProductionLineData.value?.TemplateIDS || [];
    temp.CombinationWordIDS = CombinationWordIDS || [];
    Data.addLineFrom = toRaw(actionLine.value);
  }
  addLineShow.value = true;
};
const delLine = () => {
  messageBox.warnCancelBox('确定要删除此生产线吗？', `${actionLine.value?.Name}`, () => {
    api.getProductionLineRemove(actionLine.value?.ID).then(res => {
      if (res.data.Status === 1000) {
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
    NeedFoldWay: true,
    TemplateIDS: [],
    CombinationWordIDS: [],
    ID: '',
    Name: '',
  };
};
const addLineCloseClick = () => {
  addLineShow.value = false;
};
const addLinePrimaryClick = () => {
  if (!Data.addLineFrom.Name) {
    messageBox.failSingleError('保存失败', '请输入生产线名称', () => null, () => null);
  } else {
    api.getProductionLineSave(Data.addLineFrom).then(res => {
      if (res.data.Status === 1000) {
        const cb = () => {
          addLineCloseClick();
          getProductionLineList();
        };
        // 保存成功
        messageBox.successSingle('保存成功', cb, cb);
      }
    });
  }
};
// 添加工序
const addPrcessCloseedClick = () => {
  Data.addPrcessFrom = {
    ID: '',
    WordIDS: [],
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
      if (res.data.Status === 1000) {
        const cb = () => {
          addPrcessCloseClick();
          getProductionLineWorkingProcedureList();
        };
        // 保存成功
        messageBox.successSingle('保存成功', cb, cb);
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
      if (res.data.Status === 1000) {
        const cb = () => {
          const t = ProductionLineList.value.find(it => it.ID === Data.getPocessFrom.LineID);
          if (t) {
            t.SplitWordID = Data.setSplitFrom.SplitWordID;
          }
          setSplitCloseClick();
          getProductionLineWorkingProcedureList();
        };
        // 保存成功
        messageBox.successSingle('保存成功', cb, cb);
      }
    });
  }
};
onActivated(() => {
  const processSetupPage = sessionStorage.getItem('productionLinePage') === 'true';
  if (processSetupPage) {
    getProductionLineWorkingProcedureList();
    sessionStorage.removeItem('productionLinePage');
  }
});
onMounted(() => {
  if (isCombine.value) {
    sessionStorage.removeItem('combinationProductionLinePage');
    getCombinationPrcessList();
  } else {
    if (!PasteupSettingStore.ImpositionTemmplateClassList.length) {
      PasteupSettingStore.getImpositionTemmplateClassList();
    }
    getImpositionTemmplateList();
    getsplitPrcessList();
    sessionStorage.removeItem('productionLinePage');
  }
  if (!productionSettingStore.MaterialTypeGroup.length) {
    productionSettingStore.getMaterialTypeGroupAll();
  }
  getProductionLineList();
  getPrcessList();
});
</script>

<style lang='scss'>
@import '@/assets/css/var.scss';
.production-line-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    padding: 20px;
    background-color: #fff;
    .classs{
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      .el-button{
        height: 30px;
        margin-left: 20px;
      }
    }
  }
  >main{
    flex: 1;
    margin-top: 10px;
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
        border: 1px solid #D0D0D0;
        >li{
          >.process-item{
            display: flex;
            font-size: 14px;
            align-items: center;
            // height: 37px;
            line-height: 15px;
            // padding: 0 20px;
            .equipment{
              flex: 1;
            }
            .process{
              width: 155px;
            }
            .operate{
              width: 300px;
            }
            // border: 1px solid red;
            border-bottom: 1px solid #D0D0D0;
          }
        }
        .table-title{
          position: sticky;
          top: 0;
          background-color: #fff;
          .process-item{
            height: 37px;
            align-items: center;
            text-align: center;
            border-top:none;
            font-weight: 700;
            >span+span{
              border-left: 1px solid #D0D0D0;
              height: 15px;
              text-align: center;
            }
          }
        }
        .table-main:nth-child(2n-1){
          background-color: #F5F5F5;
        }
        .table-main:hover{
          background-color: #F0F9FE;
        }
        .table-main{
          .process-item{
            height: 45px;
            align-items: center;
            border-top:none;
            .process{
              font-weight: 700;
              padding-left: 20px;
            }
            .equipment{
              padding-left: 4em;
            }
            .operate{
              display: flex;
              padding: 0 2em;
              box-sizing: border-box;
              justify-content: space-between;
            }
          }
          .material-source{
            padding-left: 30px;
            font-size: 14px;
            display: flex;
            height: 45px;
            display: flex;
            align-items: center;
            p+p{
              margin-left: 30px;
            }
            span{
              font-size: 12px;
              line-height: 14px;
            }
          }
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
    }
    >.right{
      box-sizing: border-box;
      width: 317px;
      padding: 45px 20px;
      .set-slit{
        margin-top: 10px;
      }
      .status{
        margin-top: 2em;
        font-size: 14px;
        color: #444;
        display: flex;
        align-items: center;
        font-weight: 700;
        >span{
          // color: #E42A2A;
          margin-left: 10px;
        }
        .el-button{
          font-size: 14px;
          margin-left: 10px;
        }
      }
      .line-info{
        margin-top: 2em;
        font-weight: 700;
        display: flex;
        flex-direction: column;
        .fold-the-hand{
          font-size: 12px;
          color: #888888;
          margin-left: 10px;
        }
        .btn{
          margin-top: 5px;
          font-weight: 400;
          .menu-box + .menu-box {
            margin-left: 30px;
          }
        }
      }
      .templates{
        display: flex;
        flex-direction: column;
        margin-top: 2em;
        .label{
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 4px;
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
  .add-line-dialog{
    .text{
      font-size: 14px;
      margin-left: 112px;
      margin-bottom: 15px;
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
        .temp-label {
          display: flex;
          justify-content: flex-end;
          overflow: hidden;
          > em {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        &::before {
          display: none;
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
</style>
