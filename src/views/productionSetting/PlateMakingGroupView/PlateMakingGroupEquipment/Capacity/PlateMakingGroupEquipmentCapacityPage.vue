<template>
  <EquipmentCapacityListPageContent
    v-if="PlateMakingGroupCapacityPageData"
    :BreadcrumbList="BreadcrumbList"
    :list="PlateMakingGroupCapacityPageData.list"
    :PropertyList="PlateMakingGroupCapacityPageData.PropertyList"
    :rightPropertyList="PlateMakingGroupCapacityPageData.rightPropertyList"
    @remove="remove"
    @save="ToSetup"
  />
</template>

<script lang="ts" setup>
import {
  onMounted, computed,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import EquipmentCapacityListPageContent from '@/views/productionSetting/putOutAndCapacity/capacity/EquipmentCapacityListPageContent.vue';
import { storeToRefs } from 'pinia';
import { CapacityTypeEnum } from '@/views/productionSetting/putOutAndCapacity/capacity/enum';

const productionSettingStore = useProductionSettingStore();
const { PlateMakingGroupCapacityPageData, PlateMakingGroupManageData } = storeToRefs(productionSettingStore);

const route = useRoute();
const router = useRouter();

const curLineEquipment = JSON.parse(route.params.LineEquipment as string);
productionSettingStore.setPlateMakingGroupCapacityPageData(curLineEquipment);

const BreadcrumbList = computed(() => [
  { to: { path: '/PlateMakingGroupList' }, name: '制版组' },
  {
    to: { path: '/PlateMakingGroupEquipmentList' },
    name: `选择设备/工厂：${PlateMakingGroupManageData.value.ManageListData.curEditItemHandler?.itemData.Name || ''}`,
  },
  { name: `设置产能：${PlateMakingGroupCapacityPageData.value?.curLineEquipment?.Name}` },
]);

const ToSetup = (item, type: CapacityTypeEnum) => {
  PlateMakingGroupCapacityPageData.value?.setCurConditionRow(item);
  PlateMakingGroupCapacityPageData.value?.setCurCapacityType(type);
  router.push({ name: 'plateMakingGroupEquipmentCapacitySetup' });
};

const remove = (item) => {
  PlateMakingGroupCapacityPageData.value?.handleItemRemove(item);
};

onMounted(() => {
  PlateMakingGroupCapacityPageData.value?.getInitData();
  PlateMakingGroupCapacityPageData.value?.getRightPropertyList();
});

</script>
<script lang="ts">
export default {
  name: 'PlateMakingGroupEquipmentCapacityPage',
};
</script>
<style lang='scss'>
</style>
