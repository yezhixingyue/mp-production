<template>
  <header>
    <MpBreadcrumb :list="breadcrumbList" />
  </header>
</template>

<script setup lang='ts'>
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { getNameByIDAndList } from '@/assets/js/utils';
import { EquipmentGroupMaterialTypeLimitClass } from '@/store/modules/resource/EquipmentGroupMaterialTypeLimitClass/EquipmentGroupMaterialTypeLimitClass';
import { EquipmentGroupTypeClass } from '@/store/modules/resource/EquipmentGroupTypeClass';
import { computed } from 'vue';

const props = defineProps<{
  EquipmentGroupData: Required<EquipmentGroupTypeClass>,
  MaterialTypeLimitData: Required<EquipmentGroupMaterialTypeLimitClass>,
}>();

const className = getNameByIDAndList(props.EquipmentGroupData.curEditItem?.ClassID, props.EquipmentGroupData.EquipmentClassList);
const groupName = computed(() => props.EquipmentGroupData.curEditItem?.Name);

const type = props.MaterialTypeLimitData.curConditionItem ? '编辑' : '添加';

const breadcrumbList = [
  { to: { path: '/equipmentGroup' }, name: '设备组' },
  { to: '/equipmentGroupMaterialLimitList', name: `物料限制：${className} - ${groupName.value}` },
  { name: `${type}禁用条件：${props.MaterialTypeLimitData.curMaterialTypeLimitItemTable?.title || ''}` },
];
</script>

<style scoped lang='scss'>
</style>
