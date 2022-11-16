<template>
  <!-- <PageContent /> -->
  <div>123</div>
</template>

<script setup lang='ts'>
// import PageContent from './EquipmentPutOutListPageContent.vue';
import api from '@/api';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { IGetPropOptions } from '@/components/common/ConstraintsComps/TypeClass/types';
import { onDeactivated, onMounted, ref } from 'vue';

const props = defineProps<{
  sessionStorageLabel4PropertyList: string
  fetchPropertyListParams: IGetPropOptions,
}>();

const PropertyList = ref<PropertyListItemType[]>([]);

const getPropertyList = async () => {
  const resp = await api.propertyApis.getPropertyList(props.fetchPropertyListParams).catch(() => null);
  if (resp?.data.isSuccess) {
    PropertyList.value = resp.data.Data || [];
  }
};

onMounted(() => {
  getPropertyList();
});
</script>

<style scoped lang='scss'>
</style>
