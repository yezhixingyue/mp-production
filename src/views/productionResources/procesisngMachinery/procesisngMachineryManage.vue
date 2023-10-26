<template>
  <section class="procesisng-machinery-page-wrap">
    <Header :localPermission="localPermission" @add="onItemSetupClick" :localEquipmentListClassData="localEquipmentListClassData" />
    <Main :localPermission="localPermission" :local-equipment-list-class-data="localEquipmentListClassData" @menu-click="onMenuClick" />
    <Footer :condition="localEquipmentListClassData.condition" :total="localEquipmentListClassData.listNumber" :getList="getList" />
    <Dialog :localEquipmentListClassData="localEquipmentListClassData" v-model:visible="localEquipmentListClassData.visible" @submit="submit" />
  </section>
</template>

<script setup lang='ts'>
import Header from '@/components/productionResources/procesisngMachinery/ProcesisngMachineryHeader.vue';
import Main from '@/components/productionResources/procesisngMachinery/ProcesisngMachineryMain.vue';
import Footer from '@/components/productionResources/procesisngMachinery/procesisngMachineryFooter.vue';
import Dialog from '@/components/productionResources/procesisngMachinery/procesisngMachineryDialog.vue';
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { EquipmentListClass, EquipmentTableMenuEnumType } from './TypeClass/EquipmentListClass';
import { Equipment } from './TypeClass/Equipment';

const userStore = useUserStore();
const localPermission = computed(() => userStore.user?.PermissionList.PermissionManageProduceEquipment.Obj);

const localEquipmentListClassData = ref(new EquipmentListClass());

const onItemSetupClick = (it: null | IManageEquipmentInfo) => {
  localEquipmentListClassData.value.curEditItem = it;
  localEquipmentListClassData.value.visible = true;
};

const onMenuClick = (it: IManageEquipmentInfo, type: EquipmentTableMenuEnumType) => {
  switch (type) {
    case EquipmentTableMenuEnumType.edit:
      onItemSetupClick(it);
      break;
    case EquipmentTableMenuEnumType.remove:
      localEquipmentListClassData.value.handleItemRemove(it);
      break;
    case EquipmentTableMenuEnumType.setState:
      localEquipmentListClassData.value.handleItemSetState(it);
      break;
    default:
      break;
  }
};

const getList = (e?: number) => {
  localEquipmentListClassData.value.getList(e);
};

const submit = (e: Equipment) => {
  localEquipmentListClassData.value.handleItemSubmit(e);
};

onMounted(() => {
  localEquipmentListClassData.value.fetchInitRequiredData();
});
</script>

<script lang='ts'>
export default {
  name: 'procesisngMachineryManagePage',
};
</script>

<style scoped lang='scss'>
.procesisng-machinery-page-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    height: 70px;
    margin-bottom: 10px;
    padding: 0 20px;
    box-sizing: border-box;
    > :deep(.el-button) {
      width: 130px;
      height: 30px;
      border-radius: 3px;
      margin-right: 60px;
    }
    > :deep(span.title) {
      font-weight: 700;
      color: #444;
      margin-left: 40px;
      margin-right: 5px;
      & + div {
        position: relative;
        top: 1px;
      }
    }
  }
  > main {
    flex: 1;
    overflow: hidden;
    > :deep(.el-table) {
      height: 100%;
      .el-button.is-link {
        font-size: 12px;
      }
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
