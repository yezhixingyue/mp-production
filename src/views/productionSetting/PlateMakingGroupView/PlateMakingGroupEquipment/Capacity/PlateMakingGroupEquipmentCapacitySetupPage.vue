<template>
  <EquipmentCapacitySetupPageContent
    v-if="PlateMakingGroupCapacityPageData"
    :BreadcrumbList="BreadcrumbList"
    :curConditionRow="PlateMakingGroupCapacityPageData?.curConditionRow || null"
    :PropertyList="PlateMakingGroupCapacityPageData?.PropertyList || []"
    :rightPropertyList="PlateMakingGroupCapacityPageData?.rightPropertyList || []"
    :curLineEquipment="PlateMakingGroupCapacityPageData?.curLineEquipment || null"
    :curCapacityType="PlateMakingGroupCapacityPageData.curCapacityType"
    @save="onSave"
  />
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import EquipmentCapacitySetupPageContent from '@/views/productionSetting/putOutAndCapacity/capacity/EquipmentCapacitySetupPageContent.vue';
import { CapacityTypeEnum } from '@/views/productionSetting/putOutAndCapacity/capacity/enum';

const productionSettingStore = useProductionSettingStore();
const { PlateMakingGroupCapacityPageData, PlateMakingGroupManageData } = storeToRefs(productionSettingStore);

let name = '产能';
if (PlateMakingGroupCapacityPageData.value?.curCapacityType === CapacityTypeEnum.dry) name = '干燥时间';
if (PlateMakingGroupCapacityPageData.value?.curCapacityType === CapacityTypeEnum.preparation) name = '准备时间';

const BreadcrumbList = [
  { to: { path: '/PlateMakingGroupList' }, name: '制版组' },
  {
    to: { path: '/PlateMakingGroupEquipmentList' },
    name: `选择设备/工厂：${PlateMakingGroupManageData.value.ManageListData.curEditItemHandler?.itemData.Name || ''}`,
  },
  { to: { path: '/plateMakingGroupEquipmentCapacity' }, name: `设置产能：${PlateMakingGroupCapacityPageData.value?.curLineEquipment?.Name}` },
  {
    name: `${PlateMakingGroupCapacityPageData?.value?.curConditionRow ? '编辑' : '添加'}${name}`,
  },
];

const onSave = (e) => {
  if (PlateMakingGroupCapacityPageData.value) PlateMakingGroupCapacityPageData.value.handleItemSave(e);
};

</script>

<script lang='ts'>
export default {
  name: 'PlateMakingGroupEquipmentCapacitySetupPage',
};
</script>

<style scoped lang='scss'>
</style>
