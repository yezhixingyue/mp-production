<template>
  <EquipmentListPage
    v-if="PlateMakingGroupManageData.ManageListData.ClassEquipmentGroups"
    :BreadcrumbList="BreadcrumbList"
    :ClassEquipmentGroups="PlateMakingGroupManageData.ManageListData.ClassEquipmentGroups"
    :Equipments="PlateMakingGroupManageData.ManageListData.curEditItemHandler?.itemData.Equipments"
    :curLineWorkName="PlateMakingGroupManageData.ManageListData.curEditItemHandler?.itemData.Name || ''"
    isPlateMakingGroup
    @save="handleEquipmentSubmit"
    @remove="onRemoveClick"
    @setWeight="setWeight"
    @toPutOut="ToPutOutPage"
    @tocCpacity="TocCpacityPage" />
</template>

<script setup lang='ts'>
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import EquipmentListPage from '../../putOutAndCapacity/EquipmentListPage.vue';
import { EquipmentListType, ILineEquipmentSaveParams } from '../../putOutAndCapacity/js/types';

const BreadcrumbList = computed(() => [
  {
    to: { path: '/PlateMakingGroupList' },
    name: PlateMakingGroupManageData.value.WorkingList.find(it => it.ID === PlateMakingGroupManageData.value.WorkID)?.Name || '制版组',
  },
  {
    name: `选择设备/工厂：${PlateMakingGroupManageData.value.ManageListData.curEditItemHandler?.itemData.Name || ''}`,
  },
]);

const router = useRouter();

const ProductionSettingStore = useProductionSettingStore();
const { PlateMakingGroupManageData } = storeToRefs(ProductionSettingStore);

const onRemoveClick = async (EquipmentItem: EquipmentListType) => {
  PlateMakingGroupManageData.value.ManageListData.curEditItemHandler?.handleEquipmentRemove(EquipmentItem.LineEquipmentID || EquipmentItem.ID);
};

const setWeight = (list: { ID: string, Weight: number }[]) => {
  PlateMakingGroupManageData.value.ManageListData.curEditItemHandler?.handleWeightChange(list);
};

const handleEquipmentSubmit = (params: ILineEquipmentSaveParams, callback: () => void) => {
  const cb = () => {
    callback();
  };
  PlateMakingGroupManageData.value.ManageListData.curEditItemHandler?.handleEquipmentSubmit(params, cb);
};

const ToPutOutPage = (item: EquipmentListType) => {
  if (!item.LineEquipmentID) return;
  router.push({
    name: 'plateMakingGroupEquipmentPutOut',
    params: { LineEquipment: JSON.stringify(item) },
  });
};

const TocCpacityPage = (item: EquipmentListType) => {
  if (!item.LineEquipmentID) return;
  router.push({
    name: 'plateMakingGroupEquipmentCapacity',
    params: { LineEquipment: JSON.stringify(item) },
  });
};
</script>

<script lang="ts">
export default {
  name: 'PlateMakingGroupEquipmentListPage',
};
</script>

<style scoped lang='scss'>
</style>
