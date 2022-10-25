<template>
  <div class="combination-production-line-page">
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
        <mp-button type="primary" link @click="editLine">编辑当前生产线 </mp-button>
        <mp-button type="primary" link @click="delLine">删除当前生产线</mp-button>
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
          <li class="table-main" v-for="item in ProductionLineData.ProductionLineWorkings" :key="item">
            <div class="process-item">
              <span class="process">{{[...PrcessList,...combinationPrcessList].find(it => it.ID === item.WorkID)?.Name}}</span>
              <span class="equipment">
                {{getEquipmentText(item)}}
              </span>
              <span class="operate">
                <mp-button type="primary" link @click="ToEquipment(item)">选择设备/工厂</mp-button>
                <mp-button type="primary" link @click="ToMaterialSource(item)">物料来源</mp-button>
                <mp-button type="primary" link @click="delLineWorking(item)">删除</mp-button>
              </span>
            </div>
            <!-- 物料来源 -->
            <div class="material-source" v-if="item.MaterialSources && item.MaterialSources.length">
              <!-- {{item.MaterialSources}} -->
              <template v-for="material in item.MaterialSources" :key="material.MaterialTypeID">
                <p>{{getMaterialName(material.MaterialTypeID)}}：
                  <span>
                    来自  {{getSourceWork(material).join('、')}}
                  </span>
                </p>
              </template>
            </div>
          </li>
        </ul>
        <div class="matters-need-attention">
          <span>注意事项：</span>
          <div>
            以下两种情况在设为可用状态时系统会提示错误：
            <ul>
              <li>至少需要包含一种组合工序，并且流程首个工序必须是组合工序，其物料来源至少有1个来源自其他生产线；</li>
              <li>所有工序仅可以按订单报工，不能有按大版或块报工的工序；</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="right">
        <mp-button type="primary" @click="addPrcess" :disabled="!ProductionLineList.length">+ 添加工序</mp-button>
        <p class="status">
          当前状态：<span>不可用</span>
          <mp-button type="primary" link>设为可用</mp-button>
        </p>
      </div>
    </main>
    <DialogContainerComp
    :title="`${Data.addLineFrom.ID ? '修改' : '添加'}组合生产线`"
    :visible='addLineShow'
    :width="660"
    :primaryClick="addLinePrimaryClick"
    :closeClick="addLineCloseClick"
    :closed="addLineCloseedClick"
    >
    <template #default>
      <div class="add-line-dialog">
        <el-form :model="Data.addLineFrom" label-width="112px">
          <el-form-item label="名称：" class="form-item-required">
            <div class="name">
              <el-input :maxlength="30" v-model="Data.addLineFrom.Name" />
              <el-checkbox v-model="Data.addLineFrom.NeedFoldWay" label="需要折手" />
            </div>
          </el-form-item>
          <div class="text">
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
  </div>
</template>

<script lang="ts" setup>
import {
  reactive, ref, Ref, computed, onMounted, toRaw, onActivated, watch,
} from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { useRouter } from 'vue-router';
import { useProductionSettingStore } from '@/store/modules/productionSetting';

interface ProcessListType {
  ID: string,
  Name: string
}

const router = useRouter();
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
const ProductionLineList:Ref<ProductionLineListType[]> = ref([]);
// 普通工序
const PrcessList:Ref<ProcessListType[]> = ref([]);
// 拆分工序
const combinationPrcessList:Ref<ProcessListType[]> = ref([]);
// 生产线工序列表
const ProductionLineData: any = ref([]);
const Data:DataType = reactive({
  ImpositionTemmplateList: [],
  getMaxData: {
    Page: 1,
    PageSize: 999,
    OnlyShowName: true,
  },
  addLineFrom: {
    Type: 1,
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
    LineID: 'string',
  },
});
const RadioGroupCompValue = computed(() => ({
  level1Val: Data.getPocessFrom.LineID,
  level2Val: '',
}));
// 选中的生产线
const actionLine = computed(() => ProductionLineList.value.find(item => item.ID === Data.getPocessFrom.LineID));

// 跳转物料来源
const ToMaterialSource = (item) => {
  router.push({
    name: 'combinationMaterialSource',
    params: { processInfo: JSON.stringify(item) },
  });
};
// 跳转生产设备
const ToEquipment = (item) => {
  router.push({
    name: 'combinationEquipment',
    params: { processInfo: JSON.stringify(item) },
  });
};
// 删除生产线工序
const delLineWorking = (item) => {
  console.log(item, 'item');

  messageBox.warnCancelBox('确定要删除此工序吗？', `${PrcessList.value.find(it => it.ID === item.WorkID)?.Name}`, () => {
    api.getProductionLineWorkingProcedureRemove(item.LineWorkID).then(res => {
      if (res.data.Status === 1000) {
        getProductionLineWorkingProcedureList();
      }
    });
  }, () => undefined);
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
// 获取物料工序来源
const getSourceWork = (material) => {
  const IDS = material.SourceWorkIDS;
  const returnStr:string[] = [];
  if (material.SourceType === 1) {
    returnStr.push('预出库');
  } else if (material.SourceType === 2) {
    returnStr.push('领料');
  } else if (material.SourceType === 3) {
    IDS.forEach(ID => {
      if (PrcessList.value.find(it => it.ID === ID)) {
        returnStr.push(PrcessList.value.find(it => it.ID === ID)?.Name || '');
      }
    });
  } else {
    returnStr.push('其他');
  }
  return returnStr;
};
// 获取生产线工序列表
const getProductionLineWorkingProcedureList = () => {
  api.getProductionLineWorkingProcedureList(Data.getPocessFrom).then(res => {
    if (res.data.Status === 1000) {
      ProductionLineData.value = res.data.Data as any;
    }
  });
};
const RadioGroupCompChange = (levelData) => {
  const { level1Val } = levelData;
  if (level1Val !== undefined) {
    Data.getPocessFrom.LineID = level1Val as string;
    // 获取当前生产线的所有工序();
    getProductionLineWorkingProcedureList();
  }
};
// 获取生产线列表
const getProductionLineList = () => {
  api.getProductionLineList({ Type: 1 }).then(res => {
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
  api.getWorkingProcedureSearch(3).then(res => {
    if (res.data.Status === 1000) {
      PrcessList.value = res.data.Data as ProcessListType[];
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
  console.log(ProductionLineData.value.ProductionLineWorkings, 'ProductionLineData.value.ProductionLineWorkings');

  Data.addPrcessFrom.WordIDS = ProductionLineData.value.ProductionLineWorkings.map(it => it.WorkID);
  // 格式化已经添加的工序
  addPrcessShow.value = true;
};

const editLine = () => {
  console.log(actionLine.value, 'actionLine');

  if (actionLine.value) {
    const temp = toRaw(actionLine.value);
    temp.CombinationWordIDS = temp.CombinationWordIDS || [];
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
    Type: 1,
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
  } else if (!Data.addLineFrom.CombinationWordIDS.length) {
    messageBox.failSingleError('保存失败', '请选择组合工序', () => null, () => null);
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
          addLineCloseClick();
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
  sessionStorage.removeItem('productionLinePage');
  if (!productionSettingStore.MaterialTypeGroup.length) {
    productionSettingStore.getMaterialTypeGroupAll();
  }
  getImpositionTemmplateList();
  getProductionLineList();
  getPrcessList();
  getCombinationPrcessList();
});
</script>
<script lang="ts">
export default {
  name: 'combinationProductionLinePage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.combination-production-line-page{
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
      >ul{
        flex: 1;
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
        }
      }
    }
    >.right{
      box-sizing: border-box;
      width: 317px;
      padding: 45px 20px;
      .status{
        margin-top: 2em;
        font-size: 14px;
        color: #444;
        display: flex;
        align-items: center;
        font-weight: 700;
        >span{
          color: #E42A2A;
          margin-left: 10px;
        }
        .el-button{
          font-size: 14px;
          margin-left: 10px;
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
      margin-bottom: 18px;
    }
    .notice{
      font-size: 14px;
      text-align: center;
      span{
        font-weight: 700;
      }
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
  }
}
</style>
