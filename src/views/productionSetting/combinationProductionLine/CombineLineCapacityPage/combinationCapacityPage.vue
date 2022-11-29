<template>
  <EquipmentCapacityListPageContent
    v-if="CombineLineCapacityPageData"
    :BreadcrumbList="BreadcrumbList"
    :list="CombineLineCapacityPageData.list"
    :PropertyList="CombineLineCapacityPageData.PropertyList"
    :rightPropertyList="CombineLineCapacityPageData.rightPropertyList"
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
import { CapacityTypeEnum } from '../../putOutAndCapacity/capacity/enum';

const productionSettingStore = useProductionSettingStore();
const { CombineLineCapacityPageData } = storeToRefs(productionSettingStore);

const route = useRoute();
const router = useRouter();

const curLineEquipment = JSON.parse(route.params.LineEquipment as string);
productionSettingStore.setCombineLineCapacityPageData(curLineEquipment);

const BreadcrumbList = computed(() => [
  { to: { path: '/combinationProductionLine' }, name: '组合生产线' },
  {
    to: { path: '/combinationEquipment' },
    name: `选择设备/工厂：${CombineLineCapacityPageData.value?.curWork?.Name}`,
  },
  { name: `设置产能：${CombineLineCapacityPageData.value?.curLineEquipment?.Name}` },
]);

const ToSetup = (item, type: CapacityTypeEnum) => {
  CombineLineCapacityPageData.value?.setCurConditionRow(item);
  CombineLineCapacityPageData.value?.setCurCapacityType(type);
  router.push({ name: 'combinationCapacitySetup' });
};

const remove = (item) => {
  CombineLineCapacityPageData.value?.handleItemRemove(item);
};

onMounted(() => {
  const workString = route.params.Work as string;
  const curWork: { ID: string, Name: string } | null = workString ? JSON.parse(workString) : null;
  CombineLineCapacityPageData.value?.getInitData(curWork);
  CombineLineCapacityPageData.value?.getRightPropertyList();
});

</script>
<script lang="ts">
export default {
  name: 'combinationCapacityPage',
};
</script>
<style lang='scss'>
</style>
