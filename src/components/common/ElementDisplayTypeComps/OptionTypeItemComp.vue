<template>
  <el-select
   v-model="checkVal"
   :placeholder="placeholder"
   default-first-option
   :allow-create='Allow'
   :filterable='Allow'
   no-data-text="无数据"
    ref="oSelect"
   v-if="options && options.length"
   class="mp-erp-option-type-element-display-select-comp">
    <el-option
      v-for="item in options"
      :key="item.SelectID"
      :label="item.SelectItemValue"
      :value="item.SelectID">
    </el-option>
  </el-select>
  <el-input placeholder="请输入" v-else v-model="checkVal" />
</template>

<script lang='ts' setup>
import {
  computed, ref, Ref,
} from 'vue';

const props = defineProps<{
  placeholder?: string
  PropValue?: string|number
  options?: [{SelectID:string, SelectItemValue:string}]
  UpdateData:(val:string|number) => void
  Allow?: boolean
}>();

// props: {
//     placeholder: {
//       type: String,
//       default: '请选择',
//     },
//     PropValue: {},
//     options: {
//       type: Array,
//       default: () => [],
//     },
//     UpdateData: {
//       type: Function,
//       default: () => [],
//     },
//     Allow: { // 是否允许自定义
//       type: Boolean,
//       default: false,
//     },
//   },
const oSelect = ref<Ref|null>(null);
const checkVal = computed({
  get() {
    return props.PropValue;
  },
  set(val) {
    props.UpdateData(val as string| number);
  },
});
const blur = () => {
  oSelect.value?.blur();
};
defineExpose({
  blur,
});
</script>
<style lang='scss'>
</style>
