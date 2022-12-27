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

let name = '产能';
if (CombineLineCapacityPageData.value?.curCapacityType === CapacityTypeEnum.dry) name = '干燥时间';
if (CombineLineCapacityPageData.value?.curCapacityType === CapacityTypeEnum.preparation) name = '准备时间';

const BreadcrumbList = [
  { to: { path: '/combinationProductionLine' }, name: CombineLineCapacityPageData.value?.curLineName || '组合生产线' },
  {
    to: { path: '/combinationEquipment' },
    name: `选择设备/工厂：${CombineLineCapacityPageData.value?.curWork?.Name}`,
  },
  {
    name: `设置产能：${CombineLineCapacityPageData.value?.curLineEquipment?.Name}`,
    to: { path: '/combinationCapacity' },
  },
  {
    name: `${CombineLineCapacityPageData?.value?.curConditionRow ? '编辑' : '添加'}${name}`,
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
