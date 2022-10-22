<template>
  <footer>
    <el-radio-group v-model="radioValue">
      <el-radio-button v-for="it in FilterTypeMpEnumList" :key="it.ID" :label="it.ID" >
        <el-icon><Check /></el-icon>
        {{it.Name}}
      </el-radio-button>
    </el-radio-group>
  </footer>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { FilterTypeEnum, FilterTypeMpEnumList } from './Constraints';

const props = defineProps<{
  modelValue: FilterTypeEnum
}>();

const emit = defineEmits(['update:modelValue']);

const radioValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
</script>

<style scoped lang='scss'>
</style>
