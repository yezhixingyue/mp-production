<template>
  <EquipmentPutOutListPageContent
    v-if="LinePutOutPageData"
    :BreadcrumbList="BreadcrumbList"
    :list="LinePutOutPageData.list"
    :PropertyList="LinePutOutPageData.PropertyList"
    :EquipmentData="LinePutOutPageData.EquipmentData"
    :FormulaUseModule="LinePutOutPageData.FormulaUseModule"
    :WorkingID="LinePutOutPageData.curWork?.ID"
    @remove="remove"
    @save="ToSetup"
    @imported="list => LinePutOutPageData?.handleImported(list)"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { TransformConstraintTableItemType } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import EquipmentPutOutListPageContent from '../../putOutAndCapacity/putOut/EquipmentPutOutListPageContent.vue';
import { PutOutConditionItemType } from '../../putOutAndCapacity/js/PutOutConditionItemClass';

const productionSettingStore = useProductionSettingStore();
const { LinePutOutPageData } = storeToRefs(productionSettingStore);

const route = useRoute();
const router = useRouter();

const curLineEquipment = JSON.parse(route.params.LineEquipment as string);
productionSettingStore.setLinePutOutPageData(curLineEquipment);

const BreadcrumbList = computed(() => ([
  { to: { path: '/productionLine' }, name: LinePutOutPageData.value?.curLineName || '' },
  {
    to: { path: '/equipment' },
    name: `选择设备/工厂：${LinePutOutPageData.value?.curWork?.Name || ''}`,
  },
  { name: `设置申放：${LinePutOutPageData.value?.curLineEquipment?.Name}` },
]));

const ToSetup = (item: TransformConstraintTableItemType<PutOutConditionItemType>) => {
  LinePutOutPageData.value?.setCurConditionRow(item);
  router.push({ name: 'putOutSetup' });
};

const remove = (item: TransformConstraintTableItemType<PutOutConditionItemType>) => {
  LinePutOutPageData.value?.handleItemRemove(item);
};

onMounted(() => {
  const workString = route.params.Work as string;
  const curWork: { ID: string, Name: string } | null = workString ? JSON.parse(workString) : null;

  const data = {
    EquipmentList: route.params.EquipmentList ? JSON.parse(route.params.EquipmentList as string) : [],
    curEquipID: route.params.LineEquipment ? JSON.parse(route.params.LineEquipment as string)?.LineEquipmentID || null : null,
  };

  LinePutOutPageData.value?.getInitData(curWork, route.params.lineName as string, data);
});

</script>
<script lang="ts">
export default {
  name: 'putOutPage',
};
</script>
<style lang='scss'>
</style>
