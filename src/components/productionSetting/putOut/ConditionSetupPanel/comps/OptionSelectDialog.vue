<template>
  <DialogContainerComp v-model:visible='localVisible' autoClose title="选项选择" primary-text="确定" @submit="submit" @open="onOpen" :width="700">
    <el-checkbox-group v-model="checkList" class="list">
      <el-checkbox v-for="it in OptionList" :key="it.First" :label="it.First" :title="it.Second">{{it.Second}}</el-checkbox>
    </el-checkbox-group>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IPropertyOptionListItem } from '../../TypeClass/types';

const props = withDefaults(defineProps<{
  visible: boolean,
  OptionList: IPropertyOptionListItem[],
  modelValue: string|number|(string | number)[],
}>(), {
  visible: false,
});

const emit = defineEmits(['update:visible', 'update:modelValue']);

const checkList = ref<(string | number)[]>([]);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const onOpen = () => {
  if (typeof props.modelValue === 'object') {
    checkList.value = [...props.modelValue];
  }
};

const submit = () => {
  emit('update:modelValue', checkList.value);
  localVisible.value = false;
};

</script>

<style scoped lang='scss'>
.list {
  margin-left: 15px;
  max-height: 400px;
  overflow: auto;
  white-space: normal;
  .el-checkbox {
    margin-right: 12px;
    :deep(.el-checkbox__label) {
      display: inline-block;
      vertical-align: -2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 10em;
    }
  }
}
</style>
