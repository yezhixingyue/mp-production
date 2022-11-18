<template>
  <section class="material-source-page">
    <header>
      <MpBreadcrumb :list="props.BreadcrumbList"></MpBreadcrumb>
    </header>
    <main>
      <el-table border fit stripe :data="tableList" style="width: 100%" v-if="tableList">
        <el-table-column show-overflow-tooltip prop="MaterialTypeID" label="资源包" width="316">
          <template #default="scope">
          {{scope.row._MaterialTypeGroup?.Name}}
          </template>
        </el-table-column>

        <el-table-column prop="ContactWay" label="来源" min-width="308">
          <template #default="scope">
            <span class="source">
              <el-checkbox v-if="scope.row._MaterialTypeGroup?.Feature === resourceBundleFeatureEnum.semifinished.ID"
                v-model="scope.row.NeedSource" label="必须资源"></el-checkbox>
              <el-checkbox v-model="scope.row.FactoryProvide" label="如外协则外协厂自备"></el-checkbox>
              <el-radio-group :class="{'max-margin-left':scope.row._MaterialTypeGroup?.Feature !== resourceBundleFeatureEnum.semifinished.ID}"
               v-model="scope.row.SourceType">
                <el-radio :label="MaterialSourceTypeEnum.otherLine"
                 v-if="scope.row._MaterialTypeGroup?.Feature === resourceBundleFeatureEnum.semifinished.ID">其他生产线</el-radio>
                <el-radio :label="MaterialSourceTypeEnum.outOfStorage">预出库</el-radio>
                <el-radio :label="MaterialSourceTypeEnum.picking">领料</el-radio>
                <el-radio :label="MaterialSourceTypeEnum.otherPrcess">其他工序</el-radio>
              </el-radio-group>
              <template v-if="scope.row.SourceType === 3">
                <div class="Process-list" v-if="scope.row.SourceWorkIDS && scope.row.SourceWorkIDS.length"
                  :title="scope.row.SourceWorkIDS.map(it => getProcessName(it)).join('\r\n或 ')">
                  <template v-for="(item,i) in scope.row.SourceWorkIDS" :key="item">
                    {{i === 0 ? '': ' 或 '}}
                    <span>
                      {{getProcessName(item)}}
                    </span>
                  </template>
                </div>
                <mp-button link type="primary" class="ft-13" @click="selectProcess(scope.row)">
                  选择工序
                </mp-button>
              </template>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <mp-button type="primary" class="gradient" @click="saveProcess">保存</mp-button>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
    <Dialog v-model:visible="visible" :WorkingProcedureList="localWorkingProcedureList" :originList="curRowData?.SourceWorkIDS||[]" @save="onDialogSave" />
  </section>
</template>

<script setup lang='ts'>
import api from '@/api';
import { IMpBreadcrumbItem } from '@/assets/Types/common';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import {
  IMaterialSources, IProductionLineWorkings, MaterialTypeGroupType, ProcessListType,
} from '@/store/modules/productionSetting/types';
import {
  onMounted, ref, nextTick, computed,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { getGoBackFun } from '@/router';
import { resourceBundleFeatureEnum } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import Dialog from './WorkingProcedureSelectDialog.vue';
import { MaterialSourceTypeEnum } from '../js/enums';

const productionSettingStore = useProductionSettingStore();

const props = defineProps<{
  BreadcrumbList: IMpBreadcrumbItem[],
  curEditItem: IProductionLineWorkings
  workListRange?: string[] | undefined
}>();

const emit = defineEmits(['saved']);

interface ITableItem extends IMaterialSources {
  _MaterialTypeGroup?: MaterialTypeGroupType
}

const tableList = ref<null | ITableItem[]>(null);

const visible = ref(false);
const WorkingProcedureList = ref<ProcessListType[]>([]);
const curRowData = ref<ITableItem|null>(null);
const onDialogSave = (ids: string[]) => {
  // 1. 数据改变
  if (curRowData.value) curRowData.value.SourceWorkIDS = ids;
  // 2. 关闭弹窗
  visible.value = false;
};

const localWorkingProcedureList = computed(() => {
  if (Array.isArray(props.workListRange)) {
    return WorkingProcedureList.value.filter(it => props.workListRange?.includes(it.ID));
  }
  return WorkingProcedureList.value;
});

const getProcessName = (ID) => WorkingProcedureList.value.find(it => it.ID === ID)?.Name;

const selectProcess = (item: ITableItem) => {
  curRowData.value = item;
  visible.value = true;
};

const saveProcess = async () => {
  let t = tableList.value?.find(it => !it.SourceType && it.SourceType !== 0);
  if (t) {
    MpMessage.error({
      title: '保存失败',
      msg: `<span class='ft-12'><i class='is-primary'>${t._MaterialTypeGroup?.Name}</i> 未设置来源</span>`,
      dangerouslyUseHTMLString: true,
    });
    return;
  }
  t = tableList.value?.find(it => it.SourceType === MaterialSourceTypeEnum.otherPrcess && (!it.SourceWorkIDS || it.SourceWorkIDS.length === 0));
  if (t) {
    MpMessage.error({
      title: '保存失败',
      msg: `<span class='ft-12'><i class='is-primary'>${t._MaterialTypeGroup?.Name}</i> 未设置来源工序</span>`,
      dangerouslyUseHTMLString: true,
    });
    return;
  }
  const temp = {
    LineWorkID: props.curEditItem.LineWorkID,
    Materials: tableList.value,
  };
  const resp = await api.getProductionLinetMaterialSourceSave(temp).catch(() => null);

  if (resp?.data.isSuccess) {
    const cb = async () => {
      // 处理数据变动
      emit('saved');
      await nextTick();
      getGoBackFun();
    };

    MpMessage.success({
      title: '保存成功',
      onOk: cb,
      onCancel: cb,
    });
  }
};

const getWorkingProcedureList = async () => {
  const resp = await api.getWorkingProcedureSearch().catch(() => null);
  if (resp?.data.isSuccess) {
    WorkingProcedureList.value = resp.data.Data as ProcessListType[];
  }
};

const getMaterialTypeGroupAll = async () => {
  if (!productionSettingStore.MaterialTypeGroup.length) {
    await productionSettingStore.getMaterialTypeGroupAll('null');
  }
};

onMounted(async () => {
  await Promise.all([getWorkingProcedureList(), getMaterialTypeGroupAll()]);
  tableList.value = JSON.parse(JSON.stringify(props.curEditItem.MaterialSources)).map((it: IMaterialSources) => {
    const t = productionSettingStore.MaterialTypeGroup.find(_it => _it.ID === it.MaterialTypeID);
    return {
      ...it,
      SourceWorkIDS: it.SourceWorkIDS || [],
      _MaterialTypeGroup: t, // 物料资源包
    };
  });
});

</script>

<style scoped lang='scss'>
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
    flex: none;
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
          flex-wrap: nowrap;
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
    height: 80px;
    flex: none;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    .el-button{
      width: 120px;
    }
    .el-button + .el-button{
      margin-left: 30px;
    }
  }
}
</style>
