<template>
  <section class="equipment-group-material-limit-list-page" v-if="MaterialTypeLimitData">
    <Header :EquipmentGroupData="EquipmentGroupData" :MaterialTypeLimitData="MaterialTypeLimitData" @submit="saveLimitItem" />
    <Main
      :list="MaterialTypeLimitData.list"
      :MaterialTypeGroup="MaterialTypeGroup"
      :allPropertyList="MaterialTypeLimitData.PropertyList"
      :loading="MaterialTypeLimitData.loading"
      @limitItemRemove="removeLimitItem"
      @saveConditon="onConditionSaveClick"
      @removeCondition="onConditionRemoveClick"
     />
    <Footer />
  </section>
</template>

<script setup lang='ts'>
import Header from '@/components/productionResources/EquipmentGroup/MaterialLimitList/MaterialLimitListHeader.vue';
import Main from '@/components/productionResources/EquipmentGroup/MaterialLimitList/MaterialLimitListMain.vue';
import Footer from '@/components/productionResources/EquipmentGroup/MaterialLimitList/MaterialLimitListFooter.vue';
import { useResourceStore } from '@/store/modules/resource';
import { ILimitConstraintsItem, IMaterialTypeLimitSaveParams } from '@/store/modules/resource/EquipmentGroupMaterialTypeLimitClass/types';
import { storeToRefs } from 'pinia';
import { IMaterialTypeLimitTableItemType } from '@/store/modules/resource/EquipmentGroupMaterialTypeLimitClass/MaterialTypeLimitItemClass';
import { useRouter } from 'vue-router';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';

const store = useResourceStore();
const router = useRouter();

const { EquipmentGroupData, MaterialTypeLimitData, MaterialTypeGroup } = storeToRefs(store);

if (EquipmentGroupData.value.curEditItem) {
  MaterialTypeLimitData.value.init(EquipmentGroupData.value.curEditItem);
}

const saveLimitItem = (e: IMaterialTypeLimitSaveParams, cb) => {
  MaterialTypeLimitData.value.saveLimitItem(e, cb);
};

const removeLimitItem = (item: IMaterialTypeLimitTableItemType) => {
  MaterialTypeLimitData.value.removeLimitItem(item);
};

const onConditionSaveClick = (item: IMaterialTypeLimitTableItemType, conditonItem) => { // 添加设置条件 - 跳转页面
  MaterialTypeLimitData.value.setCurMaterialTypeLimitItem(item, conditonItem);
  router.push('/equipmentGroupMaterialLimitSetup');
};

const onConditionRemoveClick = async (item: IMaterialTypeLimitTableItemType, conditonItem: ILimitConstraintsItem) => {
  MaterialTypeLimitData.value.setCurMaterialTypeLimitItem(item, conditonItem);
  const resp = await api.getEquipmentGroupMaterialTypeLimitRemove(conditonItem.ID).catch(() => null);
  if (resp?.data.isSuccess) {
    const cb = () => {
      MaterialTypeLimitData.value.handlerConditionItemChange({ conditonItem, isEdit: false, isRemove: true });
    };
    MpMessage.success({
      title: '删除成功',
      onOk: cb,
      onCancel: cb,
    });
  }
};

</script>

<script lang='ts'> // 声明页面name
export default {
  name: 'equipmentGroupMaterialLimitListPage',
};
</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.equipment-group-material-limit-list-page {
  background-color: #fff;
  box-sizing: border-box;
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  > header {
    padding-bottom: 25px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  > main {
    flex: 1;
    overflow: auto;
    @include scroll;
    padding-right: 20px;
    padding-left: 1px;
    padding-top: 15px;
    > :deep(.el-table) {
      height: 100%;
      .el-button.is-link {
        font-size: 12px;
      }
    }
  }
  > footer {
    margin-top: 20px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  > header, > footer {
    flex: none;
    :deep(.mp-button) {
      height: 30px;
      margin-right: 30px;
      border-radius: 3px;
      min-width: 120px;
    }
  }
}
</style>
