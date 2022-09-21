<template>
  <section class="equipment-classification-page-containner">
    <Header @add="onItemSetupClick" />
    <Main :list="DataList" @edit="onItemSetupClick" @remove="onRemoveClick" />
    <Footer :total="DataNumber" />
    <Dialog v-model:visible="visible" :item="curEditItem" :list="DataList" @submit="handleItemSubmit"  />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Header from '@/components/productionResources/equipmentClassification/equipmentClassificationManageHeader.vue';
import Main from '@/components/productionResources/equipmentClassification/equipmentClassificationManageMain.vue';
import Footer from '@/components/productionResources/equipmentClassification/equipmentClassificationManageFooter.vue';
import Dialog from '@/components/productionResources/equipmentClassification/equipmentClassificationManageSetupDialog.vue';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import type { EquipmentClassificationItemClassType } from './TypeClass/EquipmentClassificationItemClassType';
import type { EquipmentClassificationListItem } from './types';

const DataList = ref<EquipmentClassificationListItem[]>([]);
const DataNumber = ref(0);

const getList = async () => { // 获取列表数据
  DataList.value = [];
  const resp = await api.getEquipmentClassificationList().catch(() => null);
  if (resp?.data?.isSuccess) {
    DataList.value = resp.data.Data;
    DataNumber.value = resp.data.DataNumber;
  }
};

onMounted(() => {
  getList();
});

/** 下面为新增|编辑相关
   ------------------------------------------- */
const visible = ref(false);
const curEditItem = ref<null | EquipmentClassificationListItem>(null);

const onItemSetupClick = (item: null | EquipmentClassificationListItem) => { // 新增|编辑 点击事件
  visible.value = true;
  curEditItem.value = item;
};

const handleItemSubmit = (data: EquipmentClassificationItemClassType) => {
  const isEdit = !!curEditItem.value;
  const cb = (temp: EquipmentClassificationListItem) => {
    visible.value = false;
    // 在列表中处理新增或编辑
    if (!isEdit) {
      DataList.value.unshift(temp);
      DataNumber.value += 1;
    } else {
      const i = DataList.value.findIndex(it => it.ID === temp.ID);
      if (i > -1) DataList.value.splice(i, 1, temp);
    }
  };
  data.submit(cb);
};

/** 删除
   ------------------------------------------- */
const onRemoveClick = (item: EquipmentClassificationListItem) => {
  MpMessage.warn({
    title: '确定删除该设备分类吗 ?',
    msg: `名称：[ ${item.Name} ]`,
    onOk: () => {
      handleRemove(item.ID);
    },
  });
};

const handleRemove = async (ID: number |'') => {
  if (ID === '') return;
  const resp = await api.getEquipmentClassificationRemove(ID).catch(() => null);
  if (resp?.data?.isSuccess) {
    const cb = () => {
      const i = DataList.value.findIndex(it => it.ID === ID);
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
  name: 'equipmentClassificationManagePage',
};
</script>

<style lang='scss' scoped>
  .equipment-classification-page-containner {
    // margin: 0 8px;
    display: flex;
    flex-direction: column;
    height: 100%;
    > header {
      flex: none;
      display: flex;
      align-items: center;
      height: 75px;
      background-color: #fff;
      padding-left: 20px;
      > :deep(.el-button) {
        width: 130px;
        height: 30px;
        border-radius: 3px;
        margin-right: 40px;
      }
    }
    > main {
      flex: 1;
      margin-top: 10px;
      background-color: #fff;
      overflow: hidden;
      > :deep(.el-table) {
        height: 100%;
        // width: 800px;
      }
    }
    > footer {
      flex: none;
      height: 50px;
      background-color: #fff;
      box-sizing: border-box;
      padding-top: 5px;
    }
  }
  </style>
