<template>
  <PageContent v-if="processInfo" type="line"
    :title="curWorkName" :BreadcrumbList="BreadcrumbList" :cur-edit-item="processInfo" :workListRange="workListRange" @saved="setStorage" />
</template>

<script lang="ts" setup>
import {
  onMounted, computed, ref, Ref,
} from 'vue';
import { useRoute } from 'vue-router';
import { IProductionLineWorkings } from '@/store/modules/productionSetting/types';
import PageContent from '../MaterialSource/PageContent.vue';

const route = useRoute();
const processInfo:Ref<IProductionLineWorkings|null> = ref(null);

const curWorkName = ref('');

const BreadcrumbList = computed(() => [
  { to: { path: '/productionLine' }, name: '生产线' },
  {
    name: `设置工序物料来源：${curWorkName.value}`,
  },
]);

function setStorage() { // 设置会话存储
  sessionStorage.setItem('productionLinePage', 'true');
}

const workListRange = ref<string[]>([]);

onMounted(() => {
  const temp = JSON.parse(route.params.processInfo as string) as IProductionLineWorkings;
  if (temp) {
    processInfo.value = temp;
    const lineData = JSON.parse(route.params.lineData as string);
    workListRange.value = lineData?.ProductionLineWorkings?.filter(it => it.LineWorkID !== temp.LineWorkID).map(it => it.WorkID) || [];
    curWorkName.value = route.params.WorkName as string;
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
