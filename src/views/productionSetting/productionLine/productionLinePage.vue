<template>
  <div class="pasteup-template-page">
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
            <!-- 工序 -->
            <div class="process-item">
              <span class="process">工序</span>
              <span class="equipment">设备/外协工厂</span>
              <span class="operate">
                <mp-button type="primary" link @click="ToEquipment">选择设备/工厂</mp-button>
                <mp-button type="primary" link @click="ToMaterialSource">物料来源</mp-button>
                <mp-button type="primary" link>删除</mp-button>
              </span>
            </div>
            <!-- 物料来源 -->
            <div class="material-source">
              <p>纸张：
                <span>
                  来自  裁切、压点线、打 码、压痕、压凹、激凸、打孔、划线、喷码、写磁、圆角
                </span>
              </p>
              <p>纸张：
                <span>
                  来自  裁切、压点线、打 码、压痕、压凹、激凸、打孔、划线、喷码、写磁、圆角
                </span>
              </p>
            </div>
          </li>
          <li class="table-main">
            <!-- 工序 -->
            <div class="process-item">
              <span class="process">工序</span>
              <span class="equipment">设备/外协工厂</span>
              <span class="operate">操作</span>
            </div>
            <!-- 物料来源 -->
            <div class="material-source">
              <p>纸张：
                <span>
                  来自  裁切、压点线、打 码、压痕、压凹、激凸、打孔、划线、喷码、写磁、圆角
                </span>
              </p>
            </div>
          </li>
        </ul>
        <div class="matters-need-attention">
          <span>注意事项：</span>
          <ul>
            <li>在整个生产线工序流程中，仅可以存在一类拆分工序（但可以有多个，例如：裁切、断刀模切），即从大版到单个订单或块的拆分工序。</li>
            <li>其他把大版拆成小版，单个订单切成更小的尺寸，类似这种仅可在拼版时由拼版人员指定并生成裁切稿，此处需要设置一些游离于整个流程之外的拆分工序（信息孤岛），以供拼版人员选择，当然也可以不设置，那么拼版人员就只剩下从大版到单个订单或块的拆分工序可选择了。</li>
            <li>在设为可用状态时，系统会检测工序流程的正确性，即在生产线流程中，拆分工序前必须是按大版报工的工序，之后必须是按订单或按块报工的工序。如果流程中没有折分工序，则整个生产线流程都必须统一，即全部按大版、订单或块来报工。而流程中的拆分工序必须是按大版报工的拆分工序。</li>
            <li>按订单报工的工序下游不能有按块报工的工序，反之则允许。</li>
          </ul>
        </div>
      </div>
      <div class="right">
        <mp-button type="primary" @click="addPrcess">+ 添加工序</mp-button>
        <p class="set-slit">
          <mp-button type="primary" link>设置分切工序</mp-button>
        </p>
        <p class="status">
          当前状态：<span>不可用</span>
          <mp-button type="primary" link>设为可用</mp-button>
        </p>
        <p class="line-info">
          <span>
            {{actionLine?.Name}}<span class="fold-the-hand">需要折手</span>
          </span>
          <span class="btn">
            <mp-button type="primary" link @click="editLine">编辑</mp-button>
            <mp-button type="primary" link @click="delLine">删除</mp-button>
          </span>
        </p>
        <p class="templates">
          <span class="label">可用拼版模板：</span>
          <span>
            {{getTemplatesName().map(it => it.Name).join('、')}}
            <!-- 正反版（四开/对开/全开)、正反版（四开/对开/全开)、正反版（四开/对开/全开)、正反版（四开/对开/全开)、正反版（四开/对开/全开)、正反版（四开/对开/全开)、正反版... -->
          </span>
        </p>
      </div>
    </main>
    <DialogContainerComp
    :title="`${Data.addLineFrom.ID ? '修改' : '添加'}生产线`"
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
            可用拼版模板
          </div>
          <el-checkbox-group v-model="Data.addLineFrom.TemplateIDS">
            <el-form-item v-for="item in computedImpositionTemmplate" :key="item.ClassID" :label="`${item.Name}：`" class="form-item-required">
              <el-checkbox :label="it.ID" v-for="it in item.children" :key="it.ClassID">{{it.Name}}</el-checkbox>
            </el-form-item>
          </el-checkbox-group>
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
  reactive, ref, Ref, computed, onMounted, toRaw,
} from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import api from '@/api';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import messageBox from '@/assets/js/utils/message';
import { ProcessListType } from '@/store/modules/productionSetting/types';
import { useRouter } from 'vue-router';

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
  getPocessFrom:getPocessFromType,
}

const addLineShow = ref(false);
const addPrcessShow = ref(false);
const ProductionLineList:Ref<ProductionLineListType[]> = ref([]);
const PrcessList:Ref<ProcessListType[]> = ref([]);
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
    Type: 0,
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
const ToMaterialSource = () => {
  router.push({
    name: 'materialSource',
    // params: { process: JSON.stringify(item) },
  });
};
// 跳转生产设备
const ToEquipment = () => {
  router.push({
    name: 'equipment',
    // params: { process: JSON.stringify(item) },
  });
};
// 获取生产线工序列表
const getProductionLineWorkingProcedureList = () => {
  api.getProductionLineWorkingProcedureList(Data.getPocessFrom).then(res => {
    if (res.data.Status === 1000) {
      console.log(res.data.Data);
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
// 可用拼版模板显示
const getTemplatesName = () => {
  const returnData:ImpositionTemmplateListType[] = [];
  console.log(ProductionLineData.value.TemplateIDS, 'TemplateIDSTemplateIDSTemplateIDS');
  if (!ProductionLineData.value.TemplateIDS) return [];
  ProductionLineData.value.TemplateIDS.forEach(item => {
    const temp = Data.ImpositionTemmplateList.find(it => it.ID === item);
    if (temp) {
      returnData.push(temp);
    }
  });
  console.log(returnData, 'returnDatareturnDatareturnData');
  return returnData;
};
// 获取生产线列表
const getProductionLineList = () => {
  api.getProductionLineList().then(res => {
    if (res.data.Status === 1000) {
      ProductionLineList.value = res.data.Data as ProductionLineListType[];
      // 默认选中第一条生产线
      Data.getPocessFrom.LineID = ProductionLineList.value[0].ID || '';
      getProductionLineWorkingProcedureList();
    }
  });
};
// 获取工序列表
const getPrcessList = () => {
  api.getWorkingProcedureList(Data.getMaxData).then(res => {
    if (res.data.Status === 1000) {
      PrcessList.value = res.data.Data as ProcessListType[];
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
  // 格式化已经添加的工序
  addPrcessShow.value = true;
};
const editLine = () => {
  addLineShow.value = true;
  if (actionLine.value) {
    const temp = toRaw(actionLine.value);
    console.log(temp, 'actionLine.value');
    temp.TemplateIDS = temp.TemplateIDS || [];
    Data.addLineFrom = toRaw(actionLine.value);
  }
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
    Type: 0,
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

onMounted(() => {
  if (!PasteupSettingStore.ImpositionTemmplateClassList.length) {
    PasteupSettingStore.getImpositionTemmplateClassList();
  }
  getImpositionTemmplateList();
  getProductionLineList();
  getPrcessList();
});
</script>
<script lang="ts">
export default {
  name: 'productionLinePage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.pasteup-template-page{
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
          color: #E42A2A;
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
          margin-top: 4px;
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
      margin-bottom: 18px;
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
