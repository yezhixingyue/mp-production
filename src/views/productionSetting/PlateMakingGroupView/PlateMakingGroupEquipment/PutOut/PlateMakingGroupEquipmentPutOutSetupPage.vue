<template>
  <EquipmentPutOutSetupPageContent
    :BreadcrumbList="BreadcrumbList"
    :curConditionRow="PlateMakingGroupPutOutPageData?.curConditionRow || null"
    :PropertyList="PlateMakingGroupPutOutPageData?.PropertyList || []"
    :curLineEquipment="PlateMakingGroupPutOutPageData?.curLineEquipment || null"
    @save="onSave"
  />
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import EquipmentPutOutSetupPageContent from '@/views/productionSetting/putOutAndCapacity/putOut/EquipmentPutOutSetupPageContent.vue';
import { PutOutConditionItemClass } from '@/views/productionSetting/putOutAndCapacity/js/PutOutConditionItemClass';

const productionSettingStore = useProductionSettingStore();
const { PlateMakingGroupPutOutPageData, PlateMakingGroupManageData } = storeToRefs(productionSettingStore);

const BreadcrumbList = [
  { to: { path: '/PlateMakingGroupList' }, name: '制版组' },
  {
    to: { path: '/PlateMakingGroupEquipmentList' },
    name: `选择设备/工厂：${PlateMakingGroupManageData.value.ManageListData.curEditItemHandler?.itemData.Name || ''}`,
  },
  { to: { path: '/plateMakingGroupEquipmentPutOut' }, name: `设置伸放：${PlateMakingGroupPutOutPageData.value?.curLineEquipment?.Name}` },
  {
    name: `${PlateMakingGroupPutOutPageData?.value?.curConditionRow ? '编辑' : '添加'}伸放`,
  },
];

const onSave = (e: PutOutConditionItemClass) => {
  if (PlateMakingGroupPutOutPageData.value) PlateMakingGroupPutOutPageData.value.handleItemSave(e);
};

</script>

<script lang='ts'>
export default {
  name: 'PlateMakingGroupEquipmentPutOutSetupPage',
};
</script>

<style scoped lang='scss'>

</style>
