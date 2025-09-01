<template>
  <section class="mp-prod-condition-prop-select-dialogwrap" v-if="PlateMakingGroupManageData">
    <Header
      v-model="PlateMakingGroupManageData.WorkID"
      :WorkingList="PlateMakingGroupManageData.WorkingList"
      :loading="PlateMakingGroupManageData.loading"
      :localPermission="localPermission"
      @add="onSaveClick(null)"
      />
    <Main
      :WorkID="PlateMakingGroupManageData.WorkID"
      :list="PlateMakingGroupManageData.ManageListData.list"
      :loading="PlateMakingGroupManageData.ManageListData.loading"
      :tabLoading="PlateMakingGroupManageData.loading"
      :MaterialSourcesData="PlateMakingGroupManageData.ManageListData.MaterialSourcesData"
      :ClassEquipmentGroups="PlateMakingGroupManageData.ManageListData.ClassEquipmentGroups"
      :localPermission="localPermission"
      @edit="onSaveClick"
      @remove="onRemoveClick"
      @equipment="onEquipmentClick"
      @makingGroupSource="onMakingGroupSourceClick"
      />
    <Dialog v-model:visible="visible" :curEditItem="curEditItem" :list="PlateMakingGroupManageData.ManageListData.list" @submit="onItemChangeSubmit" />
    <Footer :listNumber="PlateMakingGroupManageData.ManageListData.listNumber" :WorkID="PlateMakingGroupManageData.WorkID" />
  </section>
</template>

<script setup lang='ts'>
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import Header from './comps/Header.vue';
import Main from './comps/Main.vue';
import Footer from './comps/Footer.vue';
import Dialog from './comps/ItemChangeDialog.vue';
import { IPlateMakingGroup } from '../js/types';

const userStore = useUserStore();
const localPermission = computed(() => userStore.user?.PermissionList.PermissionManagePlateMakeGroup.Obj);

const router = useRouter();
const ProductionSettingStore = useProductionSettingStore();
const { PlateMakingGroupManageData } = storeToRefs(ProductionSettingStore);

/**
 * 编辑与新增相关
 */
const visible = ref(false);
const curEditItem = ref<null | IPlateMakingGroup>(null);
const onItemChangeSubmit = (data) => {
  const cb = () => {
    visible.value = false;
  };
  PlateMakingGroupManageData.value.ManageListData.handleItemChange(data, cb);
};

const onSaveClick = (item: null | IPlateMakingGroup) => {
  curEditItem.value = item;
  visible.value = true;
};
const onRemoveClick = (it: IPlateMakingGroup) => {
  PlateMakingGroupManageData.value.ManageListData.remove(it);
};
const onEquipmentClick = (it: IPlateMakingGroup) => {
  PlateMakingGroupManageData.value.ManageListData.setCurEditItemHandler(it);
  // 跳转设备/工厂设置页面
  router.push('/PlateMakingGroupEquipmentList');
};
const onMakingGroupSourceClick = (it: IPlateMakingGroup) => {
  PlateMakingGroupManageData.value.ManageListData.setCurEditItemHandler(it);
  // 跳转物料来源设置页面
  router.push('/plateMakingGroupMakingGroupSource');
};

onMounted(() => {
  ProductionSettingStore.initPlateMakingGroupManageData();
});

</script>

<script lang='ts'>
export default {
  name: 'PlateMakingGroupListPage',
};
</script>

<style scoped lang='scss'>
.mp-prod-condition-prop-select-dialogwrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  > header {
    flex: none;
    box-sizing: border-box;
    padding: 15px 20px;
    min-height: 115px;
    // margin-bottom: 10px;
    background-color: #fff;
  }
  > main {
    flex: 1;
    overflow: hidden;
    background-color: #fff;
  }
  > footer {
    flex: none;
    background-color: #fff;
    height: 50px;
    box-sizing: border-box;
    padding-top: 13px;
  }
}
</style>
