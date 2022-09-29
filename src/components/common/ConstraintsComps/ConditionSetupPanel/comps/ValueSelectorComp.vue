<template>
  <div class="val-box" v-if="isNumerical">
    <!-- 值 -->
    <el-input v-model.number="value" maxlength="9" v-if="isNumerical" />
    <span class="unit">{{props.item.Property?.Unit}}</span>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { ConstraintsItemClass } from '../ConstraintsItemClass';
import { getConstraintsItemValue, getgetConstraintsItemSubmitValue, getIsNumericalType } from './utils';

const props = defineProps<{
  item: ConstraintsItemClass
}>();

const emit = defineEmits(['update:modelValue']);

// 是否为值类型
const isNumerical = computed(() => getIsNumericalType(props.item.Property));

const value = computed({
  get() {
    return getConstraintsItemValue(props.item);
  },
  set(value) {
    const val = getgetConstraintsItemSubmitValue(props.item, value);
    emit('update:modelValue', val);
  },
});

</script>

<style scoped lang='scss'>
.val-box {
  width: 140px;
  display: inline-block;
  flex: 10 0 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  :deep(.el-input) {
    width: 110px;
    input {
      text-align: left;
    }
  }
  .unit {
    font-size: 12px;
    color: #585858;
    margin-left: 8px;
  }
}
</style>
