<template>
  <EquipmentPutOutListPageContent
    v-if="CombineLinePutOutPageData"
    :BreadcrumbList="BreadcrumbList"
    :list="CombineLinePutOutPageData.list"
    :PropertyList="CombineLinePutOutPageData.PropertyList"
    :EquipmentData="CombineLinePutOutPageData.EquipmentData"
    @remove="remove"
    @save="ToSetup"
    @imported="list => CombineLinePutOutPageData?.handleImported(list)"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { TransformConstraintTableItemType } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import EquipmentPutOutListPageContent from '../../putOutAndCapacity/putOut/EquipmentPutOutListPageContent.vue';
import { PutOutConditionItemClass } from '../../putOutAndCapacity/js/PutOutConditionItemClass';

const productionSettingStore = useProductionSettingStore();
const { CombineLinePutOutPageData } = storeToRefs(productionSettingStore);

const route = useRoute();
const router = useRouter();

const curLineEquipment = JSON.parse(route.params.LineEquipment as string);
productionSettingStore.setCombineLinePutOutPageData(curLineEquipment);

const BreadcrumbList = computed(() => [
  { to: { path: '/combinationProductionLine' }, name: CombineLinePutOutPageData.value?.curLineName || '组合生产线' },
  {
    to: { path: '/combinationEquipment' },
    name: `选择设备/工厂：${CombineLinePutOutPageData.value?.curWork?.Name}`,
  },
  { name: `设置申放：${CombineLinePutOutPageData.value?.curLineEquipment?.Name}` },
]);

const ToSetup = (item: TransformConstraintTableItemType<PutOutConditionItemClass>) => {
  CombineLinePutOutPageData.value?.setCurConditionRow(item);
  router.push({ name: 'combinationPutOutSetup' });
};

const remove = (item: TransformConstraintTableItemType<PutOutConditionItemClass>) => {
  CombineLinePutOutPageData.value?.handleItemRemove(item);
};

onMounted(() => {
  const workString = route.params.Work as string;
  const curWork: { ID: string, Name: string } | null = workString ? JSON.parse(workString) : null;

  const data = {
    EquipmentList: route.params.EquipmentList ? JSON.parse(route.params.EquipmentList as string) : [],
    curEquipID: route.params.LineEquipment ? JSON.parse(route.params.LineEquipment as string)?.LineEquipmentID || null : null,
  };

  CombineLinePutOutPageData.value?.getInitData(curWork, route.params.lineName as string, data);
});

</script>
<script lang="ts">
export default {
  name: 'combinationPutOutPage',
};
</script>
<style lang='scss'>
</style>
