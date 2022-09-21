<template>
  <section class="subcontractor-manage-page-wrap">
    <Header :condition="condition" :setKeywords="setKeywords" :clearCondition="clearCondition" :getList="getList" :list="DataList" @add="onItemSetupClick" />
    <Main :list="DataList" :DistrictTreeList="DistrictTreeList" :EquipmentClassList="EquipmentClassList" @edit="onItemSetupClick" @remove="onRemoveClick" />
    <Footer :condition="condition" :total="DataNumber" :getList="getList" />
    <Dialog v-model:visible="visible" :item="curEditItem" :EquipmentClassList="EquipmentClassList" @submit="handleItemSetupSubmit" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Header from '@/components/productionResources/subcontractor/subcontractorHeader.vue';
import Main from '@/components/productionResources/subcontractor/subcontractorMain.vue';
import Footer from '@/components/productionResources/subcontractor/subcontractorFooter.vue';
import Dialog from '@/components/productionResources/subcontractor/subcontractorDialog.vue';
import CommonClassType from '@/store/modules/formattingTime/CommonClassType';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/store/modules/common/index';
import { ISubcontractorFactoryListItemType, SubcontractorFactory } from './TypeClass/SubcontractorFactory';
import { SubcontractorListCondition as Condition } from './TypeClass/SubcontractorListCondition';
import { EquipmentClassificationListItem } from '../equipmentClassification/types';

const commonStore = useCommonStore();
const { DistrictTreeList } = storeToRefs(commonStore);

const EquipmentClassList = ref<EquipmentClassificationListItem[]>([]);

/** ↓ 筛选及获取列表数据相关
 -------------------------------------*/
const condition = ref(new Condition());
const DataList = ref<ISubcontractorFactoryListItemType[]>([]);
const DataNumber = ref(0);

const setKeywords = (words: string) => {
  condition.value.KeyWords = words;
};
const clearCondition = () => {
  condition.value = new Condition();
};
const getList = async (Page = 1) => { // 获取列表数据
  condition.value.Page = Page;
  DataList.value = [];
  const temp = CommonClassType.filter(condition.value);
  const resp = await api.getSubcontractorFactoryList(temp).catch(() => null);
  if (resp?.data?.isSuccess) {
    DataList.value = resp.data.Data;
    DataNumber.value = resp.data.DataNumber;
  }
};
onMounted(async () => {
  getList();
  commonStore.getDistrictList();
  if (EquipmentClassList.value.length === 0) {
    const resp = await api.getEquipmentClassificationList().catch(() => null);
    if (resp?.data?.isSuccess) {
      EquipmentClassList.value = resp.data.Data;
    }
  }
});

/** ↓ 新增与编辑相关
 -------------------------------------*/
const visible = ref(false);
const curEditItem = ref<ISubcontractorFactoryListItemType | null>(null);

const onItemSetupClick = (it: ISubcontractorFactoryListItemType | null) => {
  curEditItem.value = it;
  visible.value = true;
};
const handleAfterSubmit = (item: ISubcontractorFactoryListItemType, isEdit: boolean) => {
  visible.value = false;
  if (!isEdit) {
    DataList.value.unshift(item);
    DataNumber.value += 1;
  } else {
    const i = DataList.value.findIndex(it => it.FactoryID === item.FactoryID);
    if (i > -1) DataList.value.splice(i, 1, item);
  }
};
const handleItemSetupSubmit = async (data: SubcontractorFactory) => {
  const isEdit = !!curEditItem.value;
  const temp = CommonClassType.filter({ ...data });
  const resp = await api.getSubcontractorFactorySave(temp).catch(() => null);
  if (resp?.data?.isSuccess) {
    const title = isEdit ? '编辑成功' : '添加成功';
    const callback = () => {
      const temp: ISubcontractorFactoryListItemType = {
        ...data,
        FactoryID: resp.data.Data,
      };
      handleAfterSubmit(temp, isEdit);
    };
    MpMessage.success({ title, onOk: callback, onCancel: callback });
  }
};

/** 删除
 ------------------------------------------- */
const onRemoveClick = (item: ISubcontractorFactoryListItemType) => {
  MpMessage.warn({
    title: '确定删除该外协工厂吗 ?',
    msg: `名称：[ ${item.Name} ]`,
    onOk: () => {
      handleRemove(item.FactoryID);
    },
  });
};

const handleRemove = async (ID: string) => {
  if (ID === '') return;
  const resp = await api.getSubcontractorFactoryRemove(ID).catch(() => null);
  if (resp?.data?.isSuccess) {
    const cb = () => {
      const i = DataList.value.findIndex(it => it.FactoryID === ID);
      if (i > -1) {
        DataList.value.splice(i, 1);
        DataNumber.value -= 1;
      }
    };

    MpMessage.success({ title: '删除成功', onOk: cb, onCancel: cb });
  }
};

</script>

<script lang='ts'>
export default {
  name: 'subcontractorManagePage',
};
</script>

<style scoped lang='scss'>
.subcontractor-manage-page-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    height: 70px;
    margin-bottom: 10px;
    padding: 0 20px;
    box-sizing: border-box;
    justify-content: space-between;
    > :deep(.el-button) {
      width: 130px;
      height: 30px;
      border-radius: 3px;
    }
  }
  > main {
    flex: 1;
    overflow: hidden;
    > :deep(.el-table) {
      height: 100%;
    }
  }
  > footer {
    height: 50px;
  }

  > header, > footer {
    flex: none;
    display: flex;
    align-items: center;
  }
  > header, > footer, > main {
    background-color: #fff;
  }
}
</style>
