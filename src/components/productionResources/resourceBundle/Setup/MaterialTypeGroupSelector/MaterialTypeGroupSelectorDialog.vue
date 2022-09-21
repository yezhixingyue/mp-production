<template>
  <DialogContainerComp v-model:visible='localVisible' autoClose title="选择物料类型" @submit="submit" @open="onOpen" :width="710" top="10vh" class="mp-group-dialog">
    <MaterialTypeGroupSelectorPanel :MaterialTypeGroup="props.MaterialTypeGroup" v-model="localValue" class="content" />
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IMaterialTypeGroupItemType } from '@/views/productionResources/resourceBundle/utils';
import { IMaterialTypeItemInBundle } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import MaterialTypeGroupSelectorPanel from './MaterialTypeGroupSelectorPanel.vue';

const props = defineProps<{
  visible: boolean,
  MaterialTypeGroup: IMaterialTypeGroupItemType[],
  getMaterialTypeGroup(): Promise<void>,
  modelValue: IMaterialTypeItemInBundle[]
}>();

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

const submit = () => {
  emit('update:modelValue', localValue.value);
  localVisible.value = false;
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
