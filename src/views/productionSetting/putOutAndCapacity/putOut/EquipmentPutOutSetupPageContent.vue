<template>
  <FormulaCommonPageContent
    v-if="formulaParams"
    title="伸放数量计算公式"
    :BreadcrumbList="BreadcrumbList"
    :row="curConditionRow"
    :PropertyList="PropertyList"
    :params="formulaParams"
    @save="submit"
  />
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { IMpBreadcrumbItem } from '@/assets/Types/common';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { TransformConstraintTableItemType } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { IFormulaItem } from '@/components/Formula/types/types';
import FormulaCommonPageContent from '@/components/Formula/FormulaCommonPageContent.vue';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import { EquipmentListType } from '../js/types';

const props = defineProps<{
  BreadcrumbList: IMpBreadcrumbItem[],
  curConditionRow: null | TransformConstraintTableItemType<IFormulaItem>,
  PropertyList: PropertyListItemType[]
  curLineEquipment: EquipmentListType | null | undefined
  FormulaUseModule?: UseModuleEnum
  Working: { ID: string; Name: string; } | null
}>();

const emit = defineEmits(['save']);

const formulaParams = computed(() => (typeof props.FormulaUseModule === 'number' ? {
  UseModule: props.FormulaUseModule,
  PositionID: props.curLineEquipment?.LineEquipmentID || '',
  EquipmentGroupID: props.curLineEquipment?.GroupID || '',
  WorkingID: props.Working?.ID || '',
} : null));

const submit = (e: IFormulaItem) => {
  emit('save', e);
};
</script>

<style scoped lang='scss'>
</style>
