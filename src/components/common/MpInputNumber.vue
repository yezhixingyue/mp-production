<template>
  <el-input-number  v-bind="$attrs" @keyup="(e) => e.key === '-' ? emit('update:modelValue', 0) : null"
    v-model="inpVal" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: number|null
}>(), {
  modelValue: null,
});
const emit = defineEmits(['update:modelValue']);
const inpVal = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
// @keyup="(e) => e.key === '-' ? emit('update:modelValue', 0) : null" 用于
</script>
