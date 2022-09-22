<template>
  <ul class="panel-wrap">
    <li v-for="it in props.MaterialTypeGroup" :key="it.CategoryID">
      <el-checkbox
       class="panel-item-title"
       :modelValue="getGroupValue(it)"
       :indeterminate="getIndeterminate(it)"
       :disabled="disabledGroupIds.includes(it.CategoryID)"
       @change="(e) => onGroupChange(it, e)">{{it.CategoryName}}</el-checkbox>
      <el-checkbox-group :modelValue="getItemValue(it)" @change="(e) => onItemChange(it, e)">
        <el-checkbox :disabled="selectedIds.includes(item.TypeID)"
          v-for="item in it.MaterialTypes" :key="item.TypeID" :label="item.TypeID">{{item.TypeName}}</el-checkbox>
      </el-checkbox-group>
    </li>
    <li v-if="props.MaterialTypeGroup.length === 0">
      <span class="is-gray-light ft-12"><el-icon class="ft-14 mr-4" style="position:relative; top: 2px"><WarningFilled /></el-icon>暂无数据，请先添加</span>
    </li>
  </ul>
</template>

<script setup lang='ts'>
import { IMaterialTypeItemInBundle } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { IMaterialTypeGroupItemType } from '@/views/productionResources/resourceBundle/utils';
import { watch, computed } from 'vue';

const props = defineProps<{
  MaterialTypeGroup: IMaterialTypeGroupItemType[],
  modelValue: IMaterialTypeItemInBundle[],
  selectedIds: string[],
}>();

const emit = defineEmits(['update:modelValue']);

const disabledGroupIds = computed(() => props.MaterialTypeGroup.map(it => {
  const t = it.MaterialTypes.find(_it => !props.selectedIds.includes(_it.TypeID));
  return t ? '' : it.CategoryID;
}).filter(it => it));

const getGroupValue = (it: IMaterialTypeGroupItemType) => {
  const t = props.modelValue.find(_it => _it.CategoryID === it.CategoryID);
  if (t) {
    const allIds = it.MaterialTypes.map(_it => _it.TypeID);
    const MaterialTypeIDS = t.MaterialTypeIDS.filter(id => allIds.includes(id));
    return MaterialTypeIDS.length === allIds.length;
  }
  return false;
};

const getIndeterminate = (it: IMaterialTypeGroupItemType) => {
  const t = props.modelValue.find(_it => _it.CategoryID === it.CategoryID);
  if (!t || t.MaterialTypeIDS.length === 0) {
    return false;
  }
  const allIds = it.MaterialTypes.map(_it => _it.TypeID);
  const MaterialTypeIDS = t.MaterialTypeIDS.filter(id => allIds.includes(id));
  return MaterialTypeIDS.length < allIds.length;
};

const onGroupChange = (it: IMaterialTypeGroupItemType, val: boolean) => {
  const list = [...props.modelValue].filter(_it => _it.CategoryID !== it.CategoryID);
  if (val) {
    const MaterialTypeIDS = it.MaterialTypes.map(_it => _it.TypeID).filter(id => !props.selectedIds.includes(id));
    const t = { CategoryID: it.CategoryID, MaterialTypeIDS };
    list.push(t);
  }
  emit('update:modelValue', list);
};

const getItemValue = (it: IMaterialTypeGroupItemType) => {
  const t = props.modelValue.find(_it => _it.CategoryID === it.CategoryID);
  return t ? [...t.MaterialTypeIDS] : [];
};

const onItemChange = (it: IMaterialTypeGroupItemType, MaterialTypeIDS: string[]) => {
  const list = [...props.modelValue].filter(_it => _it.CategoryID !== it.CategoryID);
  if (MaterialTypeIDS.length > 0) {
    const t = { CategoryID: it.CategoryID, MaterialTypeIDS };
    list.push(t);
  }
  emit('update:modelValue', list);
};

const init = () => {
  if (props.modelValue.length === 0 || props.MaterialTypeGroup.length === 0) return;
  const list = props.modelValue.map(it => {
    const { CategoryID } = it;
    const t = props.MaterialTypeGroup.find(_it => _it.CategoryID === CategoryID);
    if (t) {
      const allIds = t.MaterialTypes.map(_it => _it.TypeID);
      const MaterialTypeIDS = it.MaterialTypeIDS.filter(id => allIds.includes(id));
      if (MaterialTypeIDS.length > 0) {
        return { CategoryID, MaterialTypeIDS };
      }
    }
    return null;
  }).filter(it => it) as IMaterialTypeItemInBundle[];
  emit('update:modelValue', list);
};

watch(() => props.MaterialTypeGroup, init, { immediate: true });

</script>

<style scoped lang='scss'>
  @import '@/assets/css/mixins.scss';
  .panel-wrap {
    height: 520px;
    overflow: auto;
    overflow: overlay;
    @include scroll;
    > li {
      margin-bottom: 20px;
      > .panel-item-title {
        :deep(.el-checkbox__label) {
          font-weight: 700;
          font-size: 14px;
          color: #888;
        }
      }
      .is-checked:deep(.el-checkbox__label),
      :deep(.is-indeterminate +.el-checkbox__label) {
        color: #444;
      }
      :deep(.el-checkbox-group .el-checkbox__label) {
        width: 10em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      :deep(.el-checkbox-group .el-checkbox) {
        margin-right: 10px;
      }
    }
  }
</style>
