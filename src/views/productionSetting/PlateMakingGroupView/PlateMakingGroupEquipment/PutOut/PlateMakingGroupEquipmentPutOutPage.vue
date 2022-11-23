<template>
  <EquipmentPutOutListPageContent
    v-if="PlateMakingGroupPutOutPageData"
    :BreadcrumbList="BreadcrumbList"
    :list="PlateMakingGroupPutOutPageData.list"
    :PropertyList="PlateMakingGroupPutOutPageData.PropertyList"
    @remove="remove"
    @save="ToSetup"
  />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { TransformConstraintTableItemType } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { PutOutConditionItemClass } from '@/views/productionSetting/putOutAndCapacity/js/PutOutConditionItemClass';
import EquipmentPutOutListPageContent from '@/views/productionSetting/putOutAndCapacity/putOut/EquipmentPutOutListPageContent.vue';

const productionSettingStore = useProductionSettingStore();
const { PlateMakingGroupPutOutPageData, PlateMakingGroupManageData } = storeToRefs(productionSettingStore);

const route = useRoute();
const router = useRouter();

const curLineEquipment = JSON.parse(route.params.LineEquipment as string);
productionSettingStore.setPlateMakingGroupPutOutPageData(curLineEquipment);

const BreadcrumbList = [
  { to: { path: '/PlateMakingGroupList' }, name: '制版组' },
  {
    to: { path: '/PlateMakingGroupEquipmentList' },
    name: `选择设备/工厂：${PlateMakingGroupManageData.value.ManageListData.curEditItemHandler?.itemData.Name || ''}`,
  },
  { name: `设置申放：${PlateMakingGroupPutOutPageData.value?.curLineEquipment?.Name}` },
];

const ToSetup = (item: TransformConstraintTableItemType<PutOutConditionItemClass>) => {
  PlateMakingGroupPutOutPageData.value?.setCurConditionRow(item);
  router.push({ name: 'plateMakingGroupEquipmentPutOutSetup' });
};

const remove = (item: TransformConstraintTableItemType<PutOutConditionItemClass>) => {
  PlateMakingGroupPutOutPageData.value?.handleItemRemove(item);
};

onMounted(() => {
  PlateMakingGroupPutOutPageData.value?.getInitData();
});

</script>
<script lang="ts">
export default {
  name: 'PlateMakingGroupEquipmentPutOutPage',
};
</script>
<style lang='scss'>
</style>
