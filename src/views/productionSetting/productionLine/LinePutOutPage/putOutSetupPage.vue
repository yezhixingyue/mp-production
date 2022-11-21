<template>
  <EquipmentPutOutSetupPageContent
    :BreadcrumbList="BreadcrumbList"
    :curConditionRow="LinePutOutPageData?.curConditionRow || null"
    :PropertyList="LinePutOutPageData?.PropertyList || []"
    :curLineEquipment="LinePutOutPageData?.curLineEquipment || null"
    @save="onSave"
  />
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import EquipmentPutOutSetupPageContent from '../../putOutAndCapacity/putOut/EquipmentPutOutSetupPageContent.vue';
import { PutOutConditionItemClass } from '../../putOutAndCapacity/js/PutOutConditionItemClass';

const productionSettingStore = useProductionSettingStore();
const { LinePutOutPageData } = storeToRefs(productionSettingStore);

const BreadcrumbList = [
  { to: { path: '/productionLine' }, name: '生产线' },
  { to: { path: '/equipment' }, name: '设备工厂' },
  { to: { path: '/putOut' }, name: '申放' },
  {
    name: '申放条件',
  },
];

const onSave = (e: PutOutConditionItemClass) => {
  if (LinePutOutPageData.value) LinePutOutPageData.value.handleItemSave(e);
};

</script>

<script lang='ts'>
export default {
  name: 'putOutSetupPage',
};
</script>

<style scoped lang='scss'>

</style>
