<template>
  <main>
    <ConstraintsTable
      v-for="it in mainList"
      :key="it.ID"
      :title="it.title"
      :operate-title="'+添加禁用条件'"
      :remove-title="'删除此类型'"
      :table-list="it.LimitConstraints"
      :PropertyList="getPropertyList(it)"
      :header-intro-text="'符合如下任意一条时禁止加工，如列表为空，则此类物料均可加工'"
      @removeTable="onTableRemoveClick(it)"
      @saveCondition="(e) => onSaveClick(it, e)"
      @removeCondition="(e) => onRemoveClick(it, e)"
    />
    <mp-empty v-if="mainList.length === 0 && !props.loading" description="暂未设置物料类型限制" />
  </main>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import ConstraintsTable from '@/components/common/ConstraintsComps/ConstraintsTable/ConstraintsTable.vue';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import {
  IMaterialTypeLimitTableItemType, MaterialTypeLimitItemType,
} from '@/store/modules/resource/EquipmentGroupMaterialTypeLimitClass/MaterialTypeLimitItemClass';
import { getMaterialConstraintsListWithNames } from '@/store/modules/resource/utils/utils';
import { IMaterialTypeGroupItemType } from '@/views/productionResources/resourceBundle/utils';
import { computed } from 'vue';

const props = defineProps<{
  loading: boolean,
  list: MaterialTypeLimitItemType[]
  allPropertyList: PropertyListItemType[]
  MaterialTypeGroup: IMaterialTypeGroupItemType[]
}>();

const emit = defineEmits(['limitItemRemove', 'saveConditon', 'removeCondition']);

const mainList = computed(() => {
  const list = getMaterialConstraintsListWithNames(props.list, props.MaterialTypeGroup);
  return list.map(it => ({
    ...it,
    title: `${it.CategoryName} - ${it.MaterialTypeName}`,
  }));
});

const getPropertyList = (item: MaterialTypeLimitItemType) => {
  const list = props.allPropertyList.filter(it => it.MaterialType?.ID === item.MaterialTypeID);
  return list;
};

const onTableRemoveClick = (e: IMaterialTypeLimitTableItemType) => {
  MpMessage.warn({
    title: '确定删除该物料类型吗 ?',
    msg: `类型：[ ${e.title} ]`,
    onOk: () => {
      emit('limitItemRemove', e);
    },
  });
};

const onSaveClick = (it: IMaterialTypeLimitTableItemType, condition) => {
  emit('saveConditon', it, condition);
};

const onRemoveClick = (it: IMaterialTypeLimitTableItemType, [condition]) => {
  emit('removeCondition', it, condition);
};

</script>

<style scoped lang='scss'>
</style>
