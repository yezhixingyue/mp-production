<template>
  <EquipmentCapacitySetupPageContent
    v-if="LineCapacityPageData"
    :BreadcrumbList="BreadcrumbList"
    :curConditionRow="LineCapacityPageData?.curConditionRow || null"
    :PropertyList="LineCapacityPageData?.PropertyList || []"
    :rightPropertyList="LineCapacityPageData?.rightPropertyList || []"
    :curLineEquipment="LineCapacityPageData?.curLineEquipment || null"
    :curCapacityType="LineCapacityPageData.curCapacityType"
    @save="onSave"
  />
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import EquipmentCapacitySetupPageContent from '../../putOutAndCapacity/capacity/EquipmentCapacitySetupPageContent.vue';
import { CapacityTypeEnum } from '../../putOutAndCapacity/capacity/enum';

const productionSettingStore = useProductionSettingStore();
const { LineCapacityPageData } = storeToRefs(productionSettingStore);

let name = '产能';
if (LineCapacityPageData.value?.curCapacityType === CapacityTypeEnum.dry) name = '干燥时间';
if (LineCapacityPageData.value?.curCapacityType === CapacityTypeEnum.preparation) name = '准备时间';

const BreadcrumbList = [
  { to: { path: '/productionLine' }, name: LineCapacityPageData.value?.curLineName || '' },
  {
    to: { path: '/equipment' },
    name: `选择设备/工厂：${LineCapacityPageData.value?.curWork?.Name}`,
  },
  { to: { path: '/capacity' }, name: `设置产能：${LineCapacityPageData.value?.curLineEquipment?.Name}` },
  {
    name: `${LineCapacityPageData?.value?.curConditionRow ? '编辑' : '添加'}${name}`,
  },
];

const onSave = (e) => {
  if (LineCapacityPageData.value) LineCapacityPageData.value.handleItemSave(e);
};

</script>

<script lang='ts'>
export default {
  name: 'capacitySetupPage',
};
</script>

<style scoped lang='scss'>
</style>
