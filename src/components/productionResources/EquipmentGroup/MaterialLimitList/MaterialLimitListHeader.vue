<template>
  <header>
    <MpBreadcrumb :list="breadcrumbList" />
    <p class="mt-20">
      <MpButton type="primary" @click="visible = true">+添加物料类型</MpButton>
      <MpTips msg="如果添加有物料类型，则表示仅限列表中的物料类型可加工；如果未添加任何物料类型，则表示不限制。" />
    </p>
    <Dialog
      v-model:visible="visible"
      :MaterialTypeGroup="MaterialTypeGroup"
      :getMaterialTypeGroup="store.getMaterialTypeGroup"
      :Nullable="false"
      :autoCloseAfterClick="false"
      :selectedIds="props.MaterialTypeLimitData.list.map(it => it.MaterialTypeID) || []"
      @submit="onDialogSubmit"
    />
  </header>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { getNameByIDAndList } from '@/assets/js/utils';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import MpTips from '@/components/common/ElementPlusContainners/MpTips.vue';
import Dialog from '@/components/productionResources/resourceBundle/Setup/MaterialTypeGroupSelector/MaterialTypeGroupSelectorDialog.vue';
import { EquipmentGroupTypeClass } from '@/store/modules/resource/EquipmentGroupTypeClass';
import { IMaterialTypeItemInBundle } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { useResourceStore } from '@/store/modules/resource';
import { storeToRefs } from 'pinia';
import { EquipmentGroupMaterialTypeLimitClass } from '@/store/modules/resource/EquipmentGroupMaterialTypeLimitClass/EquipmentGroupMaterialTypeLimitClass';

const props = defineProps<{
  EquipmentGroupData: Required<EquipmentGroupTypeClass>,
  MaterialTypeLimitData: Required<EquipmentGroupMaterialTypeLimitClass>,
}>();

const emit = defineEmits(['submit']);

/** 展示相关
-------------------------------- */
const className = getNameByIDAndList(props.EquipmentGroupData.curEditItem?.ClassID, props.EquipmentGroupData.EquipmentClassList);
const groupName = computed(() => props.EquipmentGroupData.curEditItem?.Name);

const breadcrumbList = [
  { to: { path: '/equipmentGroup' }, name: '设备组' },
  { name: `物料限制：${className} - ${groupName.value}` },
];

/** 添加相关
-------------------------------- */
const store = useResourceStore();
const { MaterialTypeGroup } = storeToRefs(store);

const visible = ref(false);

const onDialogSubmit = (e: IMaterialTypeItemInBundle[]) => { // 提交
  const GroupID = props.EquipmentGroupData.curEditItem?.ID || '';
  if (!GroupID) return;
  const MaterialTypeIDS = e.map(it => it.MaterialTypeIDS).reduce((prev, next) => [...prev, ...next], []);
  const temp = {
    GroupID,
    MaterialTypeIDS,
  };
  const cb = () => {
    visible.value = false;
  };
  emit('submit', temp, cb);
};
</script>

<style scoped lang='scss'>
</style>
