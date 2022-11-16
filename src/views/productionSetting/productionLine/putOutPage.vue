<template>
  <EquipmentPutOutListPageContent
    :BreadcrumbList="BreadcrumbList"
    :list="PutOutList"
    :PropertyList="productionSettingStore.PropertyList"
    @remove="onPutOutRemoveClick"
    @save="ToSetup"
  />
</template>

<script lang="ts" setup>
import {
  onMounted, computed, ref, Ref, onActivated,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { PutOutConditionItemClass } from '@/components/productionSetting/putOut/ConditionSetupPanel/PutOutConditionItemClass';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import EquipmentPutOutListPageContent from '../putOutAndCapacity/putOut/EquipmentPutOutListPageContent.vue';
import { EquipmentListType } from '../putOutAndCapacity/js/types';

const productionSettingStore = useProductionSettingStore();

const route = useRoute();
const router = useRouter();

const LineEquipmentID = ref('');
const ReportMode = ref();
const PutOutList:Ref<PutOutConditionItemClass[]> = ref([]);
const curLineEquipment = ref<null | EquipmentListType>(null);

const BreadcrumbList = computed(() => [
  { to: { path: '/productionLine' }, name: '生产线' },
  { to: { path: '/equipmentPage' }, name: '生产线' },
  {
    name: '申放',
  },
]);
const getProductionLinePutOutList = () => {
  api.getProductionLinePutOutList(LineEquipmentID.value).then(res => {
    if (res.data.Status === 1000) {
      PutOutList.value = res.data.Data as PutOutConditionItemClass[];
    }
  });
};
const ToSetup = (item) => {
  router.push({
    name: 'putOutSetup',
    params: {
      LineEquipmentID: LineEquipmentID.value,
      ReportMode: ReportMode.value,
      putOutInfo: JSON.stringify(item),
    },
  });
};
onActivated(() => {
  const bool = sessionStorage.getItem('putOutPage') === 'true';
  if (bool) {
    getProductionLinePutOutList();
    sessionStorage.removeItem('putOutPage');
  }
});
const onPutOutRemoveClick = (item) => {
  api.getProductionLinePutOutRemove(item.ID).then(res => {
    if (res.data.Status === 1000) {
      getProductionLinePutOutList();
    }
  });
};
onMounted(() => {
  sessionStorage.removeItem('putOutPage');
  LineEquipmentID.value = route.params.LineEquipmentID as string;
  ReportMode.value = route.params.ReportMode;
  curLineEquipment.value = JSON.parse(route.params.LineEquipment as string);
  console.log(curLineEquipment.value);
  getProductionLinePutOutList();
  productionSettingStore.getPropertyList({
    UseModule: UseModuleEnum.PutOutLimit,
    EquipmentGroupID: curLineEquipment.value?.GroupID || '',
  });
});

</script>
<script lang="ts">
export default {
  name: 'putOutPage',
};
</script>
<style lang='scss'>
</style>
