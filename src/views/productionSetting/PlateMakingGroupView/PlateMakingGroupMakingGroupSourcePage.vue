<template>
  <PageContent
    type="PlateMakingGroup"
   :BreadcrumbList="BreadcrumbList"
   :params="{ GroupID: PlateMakingGroupManageData.ManageListData.curEditItemHandler?.itemData.ID }"
   :saveApiFunc="api.getPlateMakingGroupMaterialSourceSave"
   :originMaterialSources="originMaterialSources"
   :title="PlateMakingGroupManageData.ManageListData.curEditItemHandler?.itemData.Name || ''"
   withoutOtherPrcess
   @saved="handleSaved" />
</template>

<script setup lang='ts'>
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import api from '@/api';
import { IMaterialSources } from '@/store/modules/productionSetting/types';
import PageContent from '../MaterialSource/PageContent.vue';

const BreadcrumbList = computed(() => [
  { to: { path: '/PlateMakingGroupList' }, name: '制版组' },
  {
    name: `设置制版组物料来源：${PlateMakingGroupManageData.value.ManageListData.curEditItemHandler?.itemData.Name || ''}`,
  },
]);

const ProductionSettingStore = useProductionSettingStore();
const { PlateMakingGroupManageData } = storeToRefs(ProductionSettingStore);

const originMaterialSources = computed(() => {
  const list = PlateMakingGroupManageData.value.ManageListData.MaterialSourcesData?.map(it => {
    let temp: IMaterialSources = {
      MaterialTypeID: it.RelationID,
      MaterialTypeName: it.RelationName,
      SourceType: '',
      SourceWorkIDS: [],
      NeedSource: false,
      FactoryProvide: false,
    };
    const t = PlateMakingGroupManageData.value.ManageListData.curEditItemHandler?.itemData.Materials.find(it => it.MaterialTypeID === temp.MaterialTypeID);
    if (t) {
      temp = { ...t };
    }
    return temp;
  });
  return list;
});

const handleSaved = (e: IMaterialSources[]) => {
  if (!PlateMakingGroupManageData.value.ManageListData.curEditItemHandler || !e) return;
  PlateMakingGroupManageData.value.ManageListData.curEditItemHandler.itemData.Materials = e;
};

</script>

<script lang="ts">
export default {
  name: 'PlateMakingGroupMakingGroupSourcePage',
};
</script>

<style scoped lang='scss'>
</style>
