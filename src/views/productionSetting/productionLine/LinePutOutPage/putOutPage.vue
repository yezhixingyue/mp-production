<template>
  <EquipmentPutOutListPageContent
    v-if="LinePutOutPageData"
    :BreadcrumbList="BreadcrumbList"
    :list="LinePutOutPageData.list"
    :PropertyList="LinePutOutPageData.PropertyList"
    @remove="remove"
    @save="ToSetup"
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
const { LinePutOutPageData } = storeToRefs(productionSettingStore);

const route = useRoute();
const router = useRouter();

const curLineEquipment = JSON.parse(route.params.LineEquipment as string);
productionSettingStore.setLinePutOutPageData(curLineEquipment);

const BreadcrumbList = computed(() => ([
  { to: { path: '/productionLine' }, name: '生产线' },
  {
    to: { path: '/equipment' },
    name: `选择设备/工厂：${LinePutOutPageData.value?.curWorkName}`,
  },
  { name: `设置申放：${LinePutOutPageData.value?.curLineEquipment?.Name}` },
]));

const ToSetup = (item: TransformConstraintTableItemType<PutOutConditionItemClass>) => {
  LinePutOutPageData.value?.setCurConditionRow(item);
  router.push({ name: 'putOutSetup' });
};

const remove = (item: TransformConstraintTableItemType<PutOutConditionItemClass>) => {
  LinePutOutPageData.value?.handleItemRemove(item);
};

onMounted(() => {
  LinePutOutPageData.value?.getInitData(route.params.WorkName as string);
});

</script>
<script lang="ts">
export default {
  name: 'putOutPage',
};
</script>
<style lang='scss'>
</style>
