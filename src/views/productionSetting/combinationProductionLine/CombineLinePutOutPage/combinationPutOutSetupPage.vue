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
  { to: { path: '/combinationProductionLine' }, name: '组合生产线' },
  {
    to: { path: '/combinationEquipment' },
    name: `选择设备/工厂：${CombineLinePutOutPageData.value?.curWork?.Name}`,
  },
  { name: `设置伸放：${CombineLinePutOutPageData.value?.curLineEquipment?.Name}`, to: { path: '/combinationPutOut' } },
  {
    name: `${CombineLinePutOutPageData?.value?.curConditionRow ? '编辑' : '添加'}伸放`,
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
