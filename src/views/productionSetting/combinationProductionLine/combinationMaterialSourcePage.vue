<template>
  <div class="material-source-page" >
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
    </header>
    <main>
      <el-table border fit stripe
        :data="processInfo?.MaterialSources" style="width: 100%">
          <el-table-column show-overflow-tooltip prop="MaterialTypeID" label="资源包" width="316">
            <template #default="scope">
            {{getMaterial(scope.row.MaterialTypeID)?.Name}}
            </template>
          </el-table-column>

          <el-table-column
          show-overflow-tooltip prop="ContactWay" label="来源" min-width="308">
            <template #default="scope">
              <span class="source">
                <el-checkbox v-if="getMaterial(scope.row.MaterialTypeID)?.Feature === 2" v-model="scope.row.NeedSource" label="必须资源"></el-checkbox>
                <el-radio-group :class="{'max-margin-left':getMaterial(scope.row.MaterialTypeID)?.Feature !== 2}" v-model="scope.row.SourceType">
                  <el-radio :label="0" v-if="getMaterial(scope.row.MaterialTypeID)?.Feature === 2">其他生产线</el-radio>
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
import api from '@/api';
import type { ProcessListType } from '@/store/modules/productionSetting/types';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import messageBox from '@/assets/js/utils/message';
import { IProductionLineWorkings, IMaterialSources } from '@/store/modules/productionSetting/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getGoBackFun } from '@/router';

const route = useRoute();

interface rowDataType{
  data: IMaterialSources | null,
  index: string|number,
}
const { $goback } = getCurrentInstance()?.appContext.config.globalProperties || { $goback: () => null };
const productionSettingStore = useProductionSettingStore();
const setWordIDS:Ref<string[]> = ref([]);
const processInfo:Ref<IProductionLineWorkings|null> = ref(null);

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
  sessionStorage.setItem('combinationProductionLinePage', 'true');
}

const saveProcess = () => {
  const data = {
    LineWorkID: processInfo.value?.LineWorkID,
    Materials: processInfo.value?.MaterialSources,
  };
  api.getProductionLinetMaterialSourceSave(data).then(res => {
    if (res.data.Status === 1000) {
      const cb = () => {
        // 处理数据变动
        setStorage();
        getGoBackFun();
      };

      MpMessage.success({
        title: '保存成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  });
//
};
const getProcessName = (ID) => PrcessList.value.find(it => it.ID === ID)?.Name;

const getMaterial = (ID) => productionSettingStore.MaterialTypeGroup.find(it => it.ID === ID);
const selectProcess = (item, index) => {
  const temp = item;
  if (!temp.SourceWorkIDS) {
    temp.SourceWorkIDS = [];
  }
  rowData.data = temp;
  rowData.index = index;
  setWordIDS.value = rowData.data?.SourceWorkIDS || [];
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
    if (processInfo.value) {
      processInfo.value.MaterialSources[rowData.index].SourceWorkIDS = setWordIDS.value;
    }
    addPrcessCloseClick();
  }
};
onMounted(() => {
  // sessionStorage.removeItem('foldWayTemplateSteupPage');
  const temp = JSON.parse(route.params.processInfo as string) as IProductionLineWorkings;
  if (temp) {
    if (temp.MaterialSources) {
      temp.MaterialSources.forEach((it, i) => {
        // 有争议 it.SourceType可能是0 （组合生产线的情况）但在生产线不会
        if (it.SourceType === null) {
          temp.MaterialSources[i].SourceType = 1;
        }
      });
    }
    processInfo.value = temp;
  }
  api.getWorkingProcedureSearch(null).then(res => {
    if (res.data.Status === 1000) {
      PrcessList.value = res.data.Data as ProcessListType[];
    }
  });
  if (!productionSettingStore.MaterialTypeGroup.length) {
    productionSettingStore.getMaterialTypeGroupAll('null');
  }
});
</script>
<script lang="ts">
export default {
  name: 'combinationMaterialSourcePage',
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
        .el-radio-group{
          margin-left: 16px;
        }
        .max-margin-left{
          margin-left: 200px;
        }
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
