<template>
  <section class="material-source-page">
    <header>
      <MpBreadcrumb :list="props.BreadcrumbList"></MpBreadcrumb>
    </header>
    <main>
      <PageContentTable v-if="tableList" :tableList="tableList" :withoutOtherPrcess="props.withoutOtherPrcess"
       :title="props.title" :WorkingProcedureList="WorkingProcedureList" @select="selectProcess" />
      <ul class="intro">
        <li v-if="type==='combine'">如果物料资源来源于其他生产线，则必须等待其完工，当前工序才可以开始；</li>
        <li v-if="type==='line' || type==='combine'">如果一种物料资源包来源于其他某个工序，则必须等待其完工，当前工序才可开始；</li>
        <li v-if="type==='line' || type==='combine'">如果一种物料资源包来源于多个工序，指其中任意一个工序完工，便可开始当前工序；</li>
        <li>如果来源于领料，则须等待仓库出库后才可开始；</li>
        <li>预出库不需等待。</li>
      </ul>
    </main>
    <footer>
      <mp-button type="primary" class="gradient" @click="saveProcess">保存</mp-button>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
    <Dialog v-if="!props.withoutOtherPrcess"
     v-model:visible="visible" :WorkingProcedureList="localWorkingProcedureList" :originList="curRowData?.SourceWorkIDS||[]" @save="onDialogSave" />
  </section>
</template>

<script setup lang='ts'>
import api from '@/api';
import { IMpBreadcrumbItem } from '@/assets/Types/common';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import {
  IMaterialSources, IProductionLineWorkings, ProcessListType,
} from '@/store/modules/productionSetting/types';
import {
  onMounted, ref, nextTick, computed,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { getGoBackFun } from '@/router';
import { AxiosResponse } from 'axios';
import { IResponse } from '@/api/request/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import Dialog from './WorkingProcedureSelectDialog.vue';
import { MaterialSourceTypeEnum } from '../js/enums';
import PageContentTable, { ITableItem } from './PageContentTable.vue';

const productionSettingStore = useProductionSettingStore();

const props = defineProps<{
  BreadcrumbList: IMpBreadcrumbItem[],
  curEditItem?: IProductionLineWorkings
  workListRange?: string[] | undefined
  originMaterialSources?: IMaterialSources[]
  saveApiFunc?:(data: { Materials: ITableItem[] | null }) => Promise<AxiosResponse<IResponse<string>, unknown>>
  params?: object
  withoutOtherPrcess?: boolean
  title: string
  type: 'combine' | 'line' | 'PlateMakingGroup'
}>();

const emit = defineEmits(['saved']);

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

  const Materials = tableList.value?.map(it => {
    const _it = { ...it };
    delete _it._MaterialTypeGroup;
    return _it;
  }) || [];
  const temp = props.params ? { ...props.params, Materials } : { LineWorkID: props.curEditItem?.LineWorkID || '', Materials };
  const fetchFunc = props.saveApiFunc || api.getProductionLinetMaterialSourceSave;

  const resp = await fetchFunc(temp).catch(() => null);

  if (resp?.data.isSuccess) {
    const cb = async () => { // 处理数据变动
      emit('saved', Materials);
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
  if (props.withoutOtherPrcess) return;
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
  tableList.value = JSON.parse(JSON.stringify(props.originMaterialSources || props.curEditItem?.MaterialSources)).map((it: IMaterialSources) => {
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
    overflow: auto;
    overflow: overlay;
    padding-top: 20px;
    box-sizing: border-box;
    padding-left: 20px;
    .intro {
      margin-top: 10px;
      padding-left: 60px;
      position: relative;
      letter-spacing: 1px;
      &::before {
        content: '说明：';
        position: absolute;
        left: 0;
        top: 0;
      }
      li {
        list-style: disc;
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
