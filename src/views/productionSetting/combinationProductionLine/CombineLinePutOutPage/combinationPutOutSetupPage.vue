<template>
  <EquipmentPutOutSetupPageContent
    :BreadcrumbList="BreadcrumbList"
    :curConditionRow="CombineLinePutOutPageData?.curConditionRow || null"
    :PropertyList="CombineLinePutOutPageData?.PropertyList || []"
    :curLineEquipment="CombineLinePutOutPageData?.curLineEquipment || null"
    @save="onSave"
  />
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import EquipmentPutOutSetupPageContent from '../../putOutAndCapacity/putOut/EquipmentPutOutSetupPageContent.vue';
import { PutOutConditionItemClass } from '../../putOutAndCapacity/js/PutOutConditionItemClass';

const productionSettingStore = useProductionSettingStore();
const { CombineLinePutOutPageData } = storeToRefs(productionSettingStore);

const BreadcrumbList = [
  { to: { path: '/combinationProductionLine' }, name: '生产线' },
  { to: { path: '/combinationEquipment' }, name: '设备工厂' },
  { to: { path: '/combinationPutOut' }, name: '申放' },
  {
    name: '申放条件',
  },
];

const onSave = (e: PutOutConditionItemClass) => {
  if (CombineLinePutOutPageData.value) CombineLinePutOutPageData.value.handleItemSave(e);
};

</script>

<script lang='ts'>
export default {
  name: 'combinationPutOutSetupPage',
};
</script>

<style scoped lang='scss'>

</style>
