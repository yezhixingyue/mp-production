<template>
  <EquipmentCapacitySetupPageContent
    v-if="CombineLineCapacityPageData"
    :BreadcrumbList="BreadcrumbList"
    :curConditionRow="CombineLineCapacityPageData?.curConditionRow || null"
    :PropertyList="CombineLineCapacityPageData?.PropertyList || []"
    :rightPropertyList="CombineLineCapacityPageData?.rightPropertyList || []"
    :curLineEquipment="CombineLineCapacityPageData?.curLineEquipment || null"
    :curCapacityType="CombineLineCapacityPageData.curCapacityType"
    @save="onSave"
  />
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import EquipmentCapacitySetupPageContent from '../../putOutAndCapacity/capacity/EquipmentCapacitySetupPageContent.vue';
import { CapacityTypeEnum } from '../../putOutAndCapacity/capacity/enum';

const productionSettingStore = useProductionSettingStore();
const { CombineLineCapacityPageData } = storeToRefs(productionSettingStore);

let name = '设置产能';
if (CombineLineCapacityPageData.value?.curCapacityType === CapacityTypeEnum.dry) name = '设置干燥时间';
if (CombineLineCapacityPageData.value?.curCapacityType === CapacityTypeEnum.preparation) name = '设置准备时间';

const BreadcrumbList = [
  { to: { path: '/combinationProductionLine' }, name: '生产线' },
  { to: { path: '/combinationEquipment' }, name: '设备工厂' },
  { to: { path: '/combinationCapacity' }, name: '产能' },
  {
    name,
  },
];

const onSave = (e) => {
  if (CombineLineCapacityPageData.value) CombineLineCapacityPageData.value.handleItemSave(e);
};

</script>

<script lang='ts'>
export default {
  name: 'combinationCapacitySetupPage',
};
</script>

<style scoped lang='scss'>
</style>
