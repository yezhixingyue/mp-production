<template>
  <section class="material-source-page">
    <header>
      <MpBreadcrumb :list="props.BreadcrumbList"></MpBreadcrumb>
    </header>
    <main>
      <PageContentTable v-if="tableList" :tableList="tableList" :withoutOtherPrcess="props.withoutOtherPrcess"
       :hasPlateMakingWork="!!curEditItem?.PlateMakingWorkID" HideByIsPlateMaterial
       :title="props.title" :WorkingProcedureList="WorkingProcedureList" @select="selectProcess" />
      <PageContentTable v-if="tableList4PlateMaking && PlateMakingMaterialSourceSetupData"
       :tableList="tableList4PlateMaking" withoutOtherPrcess
       :title="PlateMakingMaterialSourceSetupData.WorkName" :WorkingProcedureList="WorkingProcedureList" @select="(e) => selectProcess(e, true)" />
      <ul class="intro" v-if="tableList || (tableList4PlateMaking && PlateMakingMaterialSourceSetupData)">
        <li v-if="type==='combine'">如果物料资源来源于其他生产线，则必须等待其完工，当前工序才可以开始；</li>
        <li v-if="type==='line' || type==='combine'">如果一种物料资源包来源于其他某个工序，则必须等待其完工，当前工序才可开始；</li>
        <li v-if="type==='line' || type==='combine'">如果一种物料资源包来源于多个工序，指其中任意一个工序完工，便可开始当前工序；</li>
        <li>如果来源于领料，则须等待仓库出库后才可开始；</li>
        <li>预出库不需等待。</li>
        <li>版材有且只能有一个。</li>
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
import { resourceBundleFeatureEnumObj } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import {
  IMaterialSources, IProductionLineWorkings,
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
import { IWorkingProcedureSearch } from '../PlateMakingGroupView/js/types';
import { IPlateMakingMaterialSourceSetupData } from '../productionLine/js/types';

const productionSettingStore = useProductionSettingStore();

const props = defineProps<{
  BreadcrumbList: IMpBreadcrumbItem[],
  curEditItem?: IProductionLineWorkings
  workListRange?: string[] | undefined
  originMaterialSources?: IMaterialSources[]
  saveApiFunc?:(data: { Materials: ITableItem[] | null }) => Promise<AxiosResponse<IResponse<string>, unknown>>
  params?: object
  withoutOtherPrcess?: boolean // 列表中 物料来源是否可设置为来自其它工序 （ 制版组中不可以 ）
  title: string
  type: 'combine' | 'line' | 'PlateMakingGroup'
  PlateMakingMaterialSourceSetupData?: IPlateMakingMaterialSourceSetupData | null
}>();

const emit = defineEmits(['saved']);

const tableList = ref<null | ITableItem[]>(null);

const tableList4PlateMaking = ref<null | ITableItem[]>(null);

const visible = ref(false);
const WorkingProcedureList = ref<IWorkingProcedureSearch[]>([]);
const curRowData = ref<ITableItem|null>(null);
const onDialogSave = (ids: string[]) => {
  // 1. 数据改变
  if (curRowData.value) curRowData.value.SourceWorkIDS = ids;
  // 2. 关闭弹窗
  visible.value = false;
};

const _IsPlateMakingWork = ref(false);
const selectProcess = (item: ITableItem, IsPlateMakingWork = false) => {
  curRowData.value = item;
  _IsPlateMakingWork.value = IsPlateMakingWork;
  visible.value = true;
};

const localWorkingProcedureList = computed(() => {
  let list = WorkingProcedureList.value;
  if (Array.isArray(props.workListRange)) {
    list = WorkingProcedureList.value.filter(it => props.workListRange?.includes(it.ID));
  }
  if (_IsPlateMakingWork.value) { // 设置的是制版工序物料来源
    list = list.filter(it => it.ID !== props.PlateMakingMaterialSourceSetupData?.PlateMakingWorkID);
  }
  //  else if (props.curEditItem?.PlateMakingWorkID) { // 设置的是普通工序的物料来源 且自身携带制版工序(包括制版组) --- 暂不考虑该方法 使用添加枚举方式
  //   // 此时需要把自身携带的制版工序ID添加到列表中供选择
  //   const id = props.curEditItem.PlateMakingWorkID;

  //   const t = WorkingProcedureList.value.find(it => it.ID === id);
  //   if (t) list.push(t);
  // }
  return list;
});

const saveProcess = async () => {
  if (!tableList.value) return;
  const list = [...tableList.value].map(it => {
    if (it._MaterialTypeGroup?.IsPlateMaterial) {
      // 此处强制修改版材的物料来源为0以提交接口 （为版材时不用传递配置内容，原值传递的为null，现根据接口该传默认值为0）
      const _it = it;
      _it.SourceType = MaterialSourceTypeEnum._plateMaterialDefault;
    }
    return it;
  });
  const len = tableList.value.length;
  if (tableList4PlateMaking.value) {
    list.push(...tableList4PlateMaking.value);
  }
  let t = list.find((it, i) => !it.SourceType && it.SourceType !== 0 && !(it._MaterialTypeGroup?.IsPlateMaterial && i < len));
  if (t) {
    MpMessage.error({
      title: '保存失败',
      msg: `<span class='ft-12'>[ <i class='is-primary'>${t._MaterialTypeGroup?.Name}</i> ] 未设置来源</span>`,
      dangerouslyUseHTMLString: true,
    });
    return;
  }
  t = list?.find(it => it.SourceType === MaterialSourceTypeEnum.otherPrcess
   && (!it.SourceWorkIDS || it.SourceWorkIDS.length === 0)
   && (!it.AllowSourceLine || it._MaterialTypeGroup?.Feature !== resourceBundleFeatureEnumObj.semifinished.ID));
  if (t) {
    const _msg = t._MaterialTypeGroup?.Feature === resourceBundleFeatureEnumObj.semifinished.ID ? '未设置来源工序且未设置可来自其他生产线' : '未设置来源工序';
    MpMessage.error({
      title: '保存失败',
      msg: `<span class='ft-12'>[ <i class='is-primary'>${t._MaterialTypeGroup?.Name}</i> ] ${_msg}</span>`,
      dangerouslyUseHTMLString: true,
    });
    return;
  }
  const Materials = tableList.value?.map(it => {
    const _it = { ...it };
    delete _it._MaterialTypeGroup;
    return _it;
  }) || [];
  const temp = props.params
    ? { ...props.params, Materials, IsPlateMakingWork: false }
    : { LineWorkID: props.curEditItem?.LineWorkID || '', Materials, IsPlateMakingWork: false };
  let params: object | object[] = temp;
  if (props.type === 'line' || props.type === 'combine') params = [temp];
  if (props.type === 'line' && props.PlateMakingMaterialSourceSetupData) {
    const Materials2 = tableList4PlateMaking.value?.map(it => {
      const _it = { ...it };
      delete _it._MaterialTypeGroup;
      return _it;
    }) || [];
    const temp2 = props.params
      ? { ...props.params, Materials: Materials2, IsPlateMakingWork: true }
      : { LineWorkID: props.PlateMakingMaterialSourceSetupData.PlateMakingWorkIdentID, Materials: Materials2, IsPlateMakingWork: true };
    params = [temp, temp2];
  }
  const fetchFunc = props.saveApiFunc || api.getProductionLinetMaterialSourceSave;

  const resp = await fetchFunc(params).catch(() => null);

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
    console.log(resp);
    WorkingProcedureList.value = resp.data.Data;
  }
};

const getMaterialTypeGroupAll = async () => {
  // if (!productionSettingStore.MaterialTypeGroup.length) {
  await productionSettingStore.getMaterialTypeGroupAll('null');
  // }
};

onMounted(async () => {
  await Promise.all([getWorkingProcedureList(), getMaterialTypeGroupAll()]);
  tableList.value = JSON.parse(JSON.stringify(props.originMaterialSources || props.curEditItem?.MaterialSources)).map((it: IMaterialSources) => {
    const t = productionSettingStore.MaterialTypeGroup.find(_it => _it.ID === it.MaterialTypeID);
    return {
      ...it,
      SourceWorkIDS: it.SourceWorkIDS || [],
      _MaterialTypeGroup: t, // 物料资源包
      SourceType: it.SourceType === MaterialSourceTypeEnum._plateMaterialDefault ? '' : it.SourceType,
    };
  });

  tableList4PlateMaking.value = JSON.parse(JSON.stringify(props.PlateMakingMaterialSourceSetupData?.PlateMakingMaterialSources || []))
    .map((it: IMaterialSources) => {
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
    padding-top: 0px;
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
