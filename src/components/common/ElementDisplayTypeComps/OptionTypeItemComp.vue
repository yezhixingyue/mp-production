<template>
  <el-select
   v-model="checkVal"
   :placeholder="placeholder"
   default-first-option
   :allow-create='Allow'
   :filterable='Allow'
   v-if="options.length"
   class="mp-erp-option-type-element-display-select-comp">
    <el-option
      v-for="item in options"
      :key="item.SelectID"
      :label="item.SelectItemValue"
      :value="item.SelectID">
    </el-option>
  </el-select>
  <el-input placeholder="请输入" v-else v-model.number="checkVal" />
</template>

<script lang='ts'>
import { computed } from 'vue';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    placeholder: {
      type: String,
      default: '请选择',
    },
    PropValue: { },
    options: {
      type: Array,
      default: () => [],
    },
    UpdateData: {
      type: Function,
      default: () => [],
    },
    Allow: { // 是否允许自定义
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const checkVal = computed({
      get() {
        return props.PropValue;
      },
      set(val) {
        props.UpdateData(val);
      },
    });
    return {
      checkVal,
    };
  },
};
</script>
<style lang='scss'>
</style>
