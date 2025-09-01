<template>
  <EquipmentPutOutSetupPageContent
    :BreadcrumbList="BreadcrumbList"
    :curConditionRow="LinePutOutPageData?.curConditionRow || null"
    :PropertyList="LinePutOutPageData?.PropertyList || []"
    :curLineEquipment="LinePutOutPageData?.curLineEquipment || null"
    :FormulaUseModule="LinePutOutPageData?.FormulaUseModule"
    :Working="LinePutOutPageData?.curWork || null"
    @save="onSave"
  />
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import EquipmentPutOutSetupPageContent from '../../putOutAndCapacity/putOut/EquipmentPutOutSetupPageContent.vue';
import { PutOutConditionItemType } from '../../putOutAndCapacity/js/PutOutConditionItemClass';

const productionSettingStore = useProductionSettingStore();
const { LinePutOutPageData } = storeToRefs(productionSettingStore);

const BreadcrumbList = [
  { to: { path: '/productionLine' }, name: LinePutOutPageData.value?.curLineName || '' },
  {
    to: { path: '/equipment' },
    name: `选择设备/工厂：${LinePutOutPageData.value?.curWork?.Name}`,
  },
  { to: { path: '/putOut' }, name: `设置申放：${LinePutOutPageData.value?.curLineEquipment?.Name}` },
  {
    name: `${LinePutOutPageData?.value?.curConditionRow ? '编辑' : '添加'}申放`,
  },
];

const onSave = (e: PutOutConditionItemType) => {
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
