<template>
  <EquipmentCapacityListPageContent
    v-if="CombineLineCapacityPageData"
    :BreadcrumbList="BreadcrumbList"
    :list="CombineLineCapacityPageData.list"
    :PropertyList="CombineLineCapacityPageData.PropertyList"
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
  { to: { path: '/combinationProductionLine' }, name: '生产线' },
  { to: { path: '/combinationEquipment' }, name: '设备工厂' },
  {
    name: '产能',
  },
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
  CombineLineCapacityPageData.value?.getInitData();
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
