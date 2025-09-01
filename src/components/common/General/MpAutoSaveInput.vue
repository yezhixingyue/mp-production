<template>
  <el-input class="mp-prod-condition-prop-select-dialogwrap" v-if="!useFloat" v-model.number="inpVal" :placeholder="placeholder||''" @blur="onBlur" :maxlength="maxlength||'9'"></el-input>
  <el-input class="mp-prod-condition-prop-select-dialogwrap" v-else v-model.trim="inpVal" :placeholder="placeholder||''" @blur="onBlur" :maxlength="maxlength||'9'"></el-input>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: number | ''
  placeholder?: string
  maxlength?:string
  useFloat?: boolean
}>();

const emit = defineEmits(['update:modelValue']);

const _Regxp = props.useFloat ? /^\d+(\.\d{1,2})?$/ : /^\d+$/;

const inpVal = ref(_Regxp.test(`${props.modelValue}`) ? +props.modelValue : '');

const onBlur = () => {
  if (inpVal.value === '') {
    return;
  }
  // 1. 校验输入
  if (!_Regxp.test(`${inpVal.value}`)) {
    MpMessage.error('操作失败', `格式不正确，请输入不小于0的${props.useFloat ? '数字' : '整数'}类型${props.useFloat ? '，最多2位小数' : ''}`);
    return;
  }

  // 2. 执行请求

  // 3. 触发改动
  emit('update:modelValue', inpVal.value);
};

watch(() => props.modelValue, (newVal) => {
  console.log('watch:', newVal);
  if (newVal !== inpVal.value && _Regxp.test(`${newVal}`)) {
    inpVal.value = +newVal;
  }
});

</script>

<style scoped lang='scss'>
.mp-prod-condition-prop-select-dialogwrap {
  --el-component-size: 28px;
  --el-border-radius-base: 2px;
  :deep(.el-input__wrapper) {
    padding: 1px 8px;
  }
}
</style>
