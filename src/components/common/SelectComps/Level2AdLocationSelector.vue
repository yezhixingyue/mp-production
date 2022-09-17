<template>
  <el-cascader :props="options" v-model="value" :placeholder="props.placeholder" />
</template>

<script setup lang='ts'>
import api from '@/api';
import { useCommonStore } from '@/store/modules/common';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

const props = withDefaults(defineProps<{
  placeholder?: string,
  ProvinceID: number | '',
  CityID: number | '',
}>(), {
  placeholder: '请选择城市',
});

const emit = defineEmits(['update:ProvinceID', 'update:CityID']);

const commonStore = useCommonStore();
const { DistrictTreeList } = storeToRefs(commonStore);

const options = {
  expandTrigger: 'hover',
  lazy: true,
  lazyLoad: async (node, resolve) => {
    const { level, value } = node;
    if (DistrictTreeList.value.length > 0) {
      if (level === 0) {
        const nodes = DistrictTreeList.value.map(it => ({ label: it.Name, value: it.ID, leaf: false }));
        resolve(nodes);
      } else {
        const t = DistrictTreeList.value.find(it => it.ID === value);
        resolve(t && t.children ? t.children.map(it => ({ label: it.Name, value: it.ID, leaf: true })) : []);
      }
      return;
    }

    const id = level === 0 ? -1 : value;

    const resp = await api.getDistrictList(id).catch(() => null);
    if (resp?.data?.isSuccess) {
      const nodes = resp.data.Data.map(it => ({ label: it.Name, value: it.ID, leaf: id !== -1 }));
      resolve(nodes);
    } else {
      resolve([]);
    }
  },
};

const value = computed({
  get() {
    if (typeof props.ProvinceID === 'number' && typeof props.CityID === 'number') {
      return [props.ProvinceID, props.CityID];
    }
    return [];
  },
  set([ProvinceID, CityID]) {
    if (typeof ProvinceID === 'number' && typeof CityID === 'number') {
      emit('update:ProvinceID', ProvinceID);
      emit('update:CityID', CityID);
    }
  },
});

onMounted(() => {
  commonStore.getDistrictList();
});

</script>

<style scoped lang='scss'>
</style>
