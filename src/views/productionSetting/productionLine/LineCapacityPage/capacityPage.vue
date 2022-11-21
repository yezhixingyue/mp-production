<template>
  <EquipmentCapacityListPageContent
    v-if="LineCapacityPageData"
    :BreadcrumbList="BreadcrumbList"
    :list="LineCapacityPageData.list"
    :PropertyList="LineCapacityPageData.PropertyList"
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
  { to: { path: '/equipmentPage' }, name: '设备工厂' },
  {
    name: '产能',
  },
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
  LineCapacityPageData.value?.getInitData();
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
