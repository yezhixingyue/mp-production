<template>
  <DialogContainerComp v-model:visible='localVisible' autoClose :title="props.title" :primary-text="props.primaryText"
    @submit="submit" @open="onOpen" :width="710" top="10vh" class="mp-group-dialog">
    <MaterialTypeGroupSelectorPanel :MaterialTypeGroup="props.MaterialTypeGroup" :selectedIds="localSelectedIds" v-model="localValue" class="content" />
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IMaterialTypeGroupItemType } from '@/views/productionResources/resourceBundle/utils';
import { IMaterialTypeItemInBundle } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import MaterialTypeGroupSelectorPanel from './MaterialTypeGroupSelectorPanel.vue';

const props = withDefaults(defineProps<{
  visible: boolean,
  MaterialTypeGroup: IMaterialTypeGroupItemType[],
  getMaterialTypeGroup(): Promise<void>,
  modelValue?: IMaterialTypeItemInBundle[],
  autoCloseAfterClick?: boolean, // 点击后自动关闭弹窗
  Nullable?: boolean, // 保存时是否可以为空
  primaryText?: string,
  title?: string
  selectedIds?: string[] // 已选中的物料id列表 -- 传入有值时禁用传入的已选中物料（暂定）
}>(), {
  autoCloseAfterClick: true,
  Nullable: true,
  modelValue: () => [],
  primaryText: '保存',
  title: '选择物料类型',
  selectedIds: () => [],
});

const emit = defineEmits(['update:visible', 'submit', 'update:modelValue']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const localValue = ref<IMaterialTypeItemInBundle[]>(props.modelValue.map(it => JSON.parse(JSON.stringify(it))));

const localSelectedIds = computed(() => { // ---- 编辑时 筛除掉当前编辑项目的id
  const curIds = props.modelValue.map(it => it.MaterialTypeIDS).reduce((prev, next) => [...prev, ...next], []);
  const list = props.selectedIds.filter(id => !curIds.includes(id));
  return list;
});

const submit = () => {
  if (!props.Nullable && localValue.value.length === 0) {
    MpMessage.error({ title: '请先选择物料' });
    return;
  }
  emit('update:modelValue', localValue.value);
  if (props.autoCloseAfterClick) localVisible.value = false;
  emit('submit', localValue.value);
};

const onOpen = () => {
  localValue.value = props.modelValue.map(it => JSON.parse(JSON.stringify(it)));
  if (props.MaterialTypeGroup.length === 0) {
    props.getMaterialTypeGroup();
  }
};

</script>

<style scoped lang='scss'>
  .content {
    margin-top: -20px;
    padding: 0 20px
  }
</style>
