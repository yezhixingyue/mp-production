<template>
  <EquipmentCapacityListPageContent
    v-if="LineCapacityPageData"
    :BreadcrumbList="BreadcrumbList"
    :list="LineCapacityPageData.list"
    :PropertyList="LineCapacityPageData.PropertyList"
    :rightPropertyList="LineCapacityPageData.rightPropertyList"
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
const { LineCapacityPageData } = storeToRefs(productionSettingStore);

const route = useRoute();
const router = useRouter();

const curLineEquipment = JSON.parse(route.params.LineEquipment as string);
productionSettingStore.setLineCapacityPageData(curLineEquipment);

const BreadcrumbList = computed(() => [
  { to: { path: '/productionLine' }, name: '生产线' },
  {
    to: { path: '/equipment' },
    name: `选择设备/工厂：${LineCapacityPageData.value?.curWork?.Name}`,
  },
  { name: `设置产能：${LineCapacityPageData.value?.curLineEquipment?.Name}` },
]);

const ToSetup = (item, type: CapacityTypeEnum) => {
  LineCapacityPageData.value?.setCurConditionRow(item);
  LineCapacityPageData.value?.setCurCapacityType(type);
  router.push({ name: 'capacitySetup' });
};

const remove = (item) => {
  LineCapacityPageData.value?.handleItemRemove(item);
};

onMounted(() => {
  const workString = route.params.Work as string;
  const curWork: { ID: string, Name: string } | null = workString ? JSON.parse(workString) : null;
  LineCapacityPageData.value?.getInitData(curWork);
  LineCapacityPageData.value?.getRightPropertyList();
});

</script>
<script lang="ts">
export default {
  name: 'capacityPage',
};
</script>
<style lang='scss'>
</style>
