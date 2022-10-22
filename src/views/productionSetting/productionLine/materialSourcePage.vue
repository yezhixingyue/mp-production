<template>
  <div class="material-source-page" >
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
    </header>
    <main>
      <el-table border fit stripe
        :data="processInfo.MaterialSources" style="width: 100%">
          <el-table-column show-overflow-tooltip prop="MaterialTypeID" label="资源包" width="316">
            <template #default="scope">
            {{getMaterialName(scope.row.MaterialTypeID)}}
            </template>
          </el-table-column>

          <el-table-column
          show-overflow-tooltip prop="ContactWay" label="来源" min-width="308">
            <template #default="scope">
              <span class="source">
                <el-radio-group v-model="scope.row.SourceType">
                  <el-radio :label="1">预出库</el-radio>
                  <el-radio :label="2">领料</el-radio>
                  <el-radio :label="3">其他工序</el-radio>
                </el-radio-group>
                <template v-if="scope.row.SourceType === 3">
                  <div class="Process-list" v-if="scope.row.SourceWorkIDS && scope.row.SourceWorkIDS.length">
                    <template v-for="(item,i) in scope.row.SourceWorkIDS" :key="item">
                      {{i === 0 ? '': ' 或 '}}
                      <span>
                        {{getProcessName(item)}}
                      </span>
                    </template>
                  </div>
                  <mp-button link type="primary" @click="selectProcess(scope.row, scope.$index)">
                    选择工序
                  </mp-button>
                </template>
              </span>
            </template>
          </el-table-column>
        </el-table>
    </main>
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
          <el-checkbox-group v-model="setWordIDS">
            <template v-for="item in PrcessList" :key="item.ClassID" >
              <el-checkbox :label="item.ID">{{item.Name}}</el-checkbox>
            </template>
          </el-checkbox-group>
      </div>
    </template>
    </DialogContainerComp>
    <footer>
      <mp-button type="primary" class="gradient" @click="saveProcess">保存</mp-button>
      <mp-button class="blue" @click="$goback">返回</mp-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
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

interface rowDataType{
  data: any,
  index: string|number,
}
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

const setWordIDS = ref([]);
const processInfo:any = ref({});
const addPrcessShow = ref(false);
const PrcessList: Ref<ProcessListType[]> = ref([]);
const rowData:rowDataType = reactive({
  data: null,
  index: '',
});

const BreadcrumbList = computed(() => [
  { to: { path: '/productionLine' }, name: '生产线' },
  {
    name: '物料来源',
  },
]);

function setStorage() { // 设置会话存储
  sessionStorage.setItem('processSetupPage', 'true');
}

const saveProcess = () => {
  const data = {
    LineWorkID: processInfo.value.LineWorkID,
    Materials: processInfo.value.MaterialSources,
  };
  api.getProductionLinetMaterialSourceSave(data).then(res => {
    if (res.data.Status === 1000) {
      console.log(res.data.Data);
    }
  });
//
};
const getProcessName = (ID) => PrcessList.value.find(it => it.ID === ID)?.Name;

const getMaterialName = (ID) => productionSettingStore.MaterialTypeGroup.find(it => it.ID === ID)?.Name;
const selectProcess = (item, index) => {
  const temp = item;
  if (!temp.SourceWorkIDS) {
    temp.SourceWorkIDS = [];
  }
  rowData.data = temp;
  rowData.index = index;
  setWordIDS.value = rowData.data.SourceWorkIDS;
  addPrcessShow.value = true;
};
const addPrcessCloseedClick = () => {
  setWordIDS.value = [];
  rowData.data = null;
  rowData.index = '';
};
const addPrcessCloseClick = () => {
  addPrcessShow.value = false;
};
const addPrcessPrimaryClick = () => {
  if (!setWordIDS.value.length) {
    messageBox.failSingleError('失败', '请选择工序', () => null, () => null);
  } else {
    processInfo.value.MaterialSources[rowData.index].SourceWorkIDS = setWordIDS.value;
    addPrcessCloseClick();
  }
};
onMounted(() => {
  // sessionStorage.removeItem('foldWayTemplateSteupPage');
  const temp = JSON.parse(route.params.processInfo as string) as any;
  if (temp) {
    if (temp.MaterialSources) {
      temp.MaterialSources.forEach((it, i) => {
        // 有争议 it.SourceType可能是0 （组合生产线的情况）但在生产线不会
        if (!it.SourceType) {
          temp.MaterialSources[i].SourceType = 1;
        }
      });
    }
    processInfo.value = temp;
  }
  api.getWorkingProcedureList({ Page: 1, PageSize: 999 }).then(res => {
    if (res.data.Status === 1000) {
      PrcessList.value = res.data.Data as ProcessListType[];
    }
  });
  if (!productionSettingStore.MaterialTypeGroup.length) {
    productionSettingStore.getMaterialTypeGroupAll();
  }
});
</script>
<script lang="ts">
export default {
  name: 'materialSourcePage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-source-page{
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
    .el-table{
      height: 100%;
      .source{
        display: flex;
        line-height: 32px;
        .Process-list{
          padding: 0 20px;
          padding-right: 0;
          max-width: calc(100% - 63px - 238px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          height: 32px;
          color: #F4A307;
          span{
            color: #444;
          }
        }
        .el-button{
          margin-left: 20px;
        }
      }
      .el-table__header-wrapper, .el-table__body-wrapper{
        tr{
          th:nth-child(2)>.cell{
            padding-left: 150px !important;
          }
          .el-table__cell:nth-child(2)>.cell{
            box-sizing: border-box;
            text-align: left;
            padding-left: 50px;
          }
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
