<template>
  <section class="equipment-group-material-limit-list-page">
    <Header :EquipmentGroupData="EquipmentGroupData" @submit="handleAddSubmit" />
  </section>
</template>

<script setup lang='ts'>
import Header from '@/components/productionResources/EquipmentGroup/MaterialLimitList/MaterialLimitListHeader.vue';
import { useResourceStore } from '@/store/modules/resource';
import { IMaterialTypeLimitSaveParams } from '@/store/modules/resource/EquipmentGroupTypeClass';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useResourceStore();
const { EquipmentGroupData } = storeToRefs(store);

if (!EquipmentGroupData.value.curEditItem) {
  router.replace({ path: '/equipmentGroup' });
}

const handleAddSubmit = (e: IMaterialTypeLimitSaveParams, cb: () => void) => {
  EquipmentGroupData.value.submitMaterialTypeLimitSave(e, cb);
};

</script>

<script lang='ts'> // 声明页面name
export default {
  name: 'equipmentGroupMaterialLimitListPage',
};
</script>

<style scoped lang='scss'>
.equipment-group-material-limit-list-page {
  background-color: #fff;
  height: 100%;
  box-sizing: border-box;
  padding: 12px 20px;
  > header {
    padding-bottom: 20px;
  }
}
</style>
