<template>
  <PageContent
   v-if="processInfo"
   type="line"
   :title="curWorkName"
   :BreadcrumbList="BreadcrumbList"
   :cur-edit-item="processInfo"
   :workListRange="workListRange"
   :PlateMakingMaterialSourceSetupData="PlateMakingMaterialSourceSetupData"
   @saved="setStorage" />
</template>

<script lang="ts" setup>
import {
  onMounted, computed, ref, Ref,
} from 'vue';
import { useRoute } from 'vue-router';
import { IProductionLineWorkings } from '@/store/modules/productionSetting/types';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { storeToRefs } from 'pinia';
import PageContent from '../MaterialSource/PageContent.vue';
import { IPlateMakingMaterialSourceSetupData } from './js/types';

const route = useRoute();
const processInfo:Ref<IProductionLineWorkings|null> = ref(null);

const curWorkName = ref('');
const curLineName = ref('');

const BreadcrumbList = computed(() => [
  { to: { path: '/productionLine' }, name: curLineName.value },
  {
    name: `设置工序物料来源：${curWorkName.value}`,
  },
]);

function setStorage() { // 设置会话存储
  sessionStorage.setItem('productionLinePage', 'true');
}

const workListRange = ref<string[]>([]);

const productionSettingStore = useProductionSettingStore();
const { PlateMakingWorkSetupHander } = storeToRefs(productionSettingStore);

const PlateMakingMaterialSourceSetupData = computed<IPlateMakingMaterialSourceSetupData | null>(() => {
  if (!processInfo.value) return null;
  if (processInfo.value.PlateMakingWorkID && !processInfo.value.PlateMakingGroupID && processInfo.value.PlateMakingWorkIdentID) {
    const t = PlateMakingWorkSetupHander.value.PlateMakingWorkAllList.find(it => it.ID === processInfo.value?.PlateMakingWorkID);
    if (t && processInfo.value.PlateMakingMaterialSources) {
      return {
        WorkName: t.Name,
        PlateMakingMaterialSources: processInfo.value.PlateMakingMaterialSources,
        PlateMakingWorkIdentID: processInfo.value.PlateMakingWorkIdentID,
        PlateMakingWorkID: processInfo.value.PlateMakingWorkID,
      };
    }
  }
  return null;
});

onMounted(() => {
  const temp = JSON.parse(route.params.processInfo as string) as IProductionLineWorkings;
  if (temp) {
    processInfo.value = temp;
    const lineData = JSON.parse(route.params.lineData as string);
    workListRange.value = lineData?.ProductionLineWorkings?.filter(it => it.LineWorkID !== temp.LineWorkID).map(it => it.WorkID) || [];
    curWorkName.value = route.params.WorkName as string;
    curLineName.value = route.params.lineName as string;
  }
});
</script>
<script lang="ts">
export default {
  name: 'materialSourcePage',
};
</script>
<style lang='scss'>
</style>
