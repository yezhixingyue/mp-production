<template>
<!-- <span> -->
  <el-input placeholder="请输入" v-if="!InputContent" v-model.number="inpVal" />

  <el-select
    v-if="InputContent"
    v-model="inpVal"
    :filterable='Allow'
    default-first-option
    :allow-create='Allow'
    placeholder="请选择"
    ref="oSelect"
    class="mp-erp-number-type-element-display-select-comp">
    <el-option
      v-for="(item,index) in options"
      :key="item + '' + index"
      :label="item"
      :value="item">
    </el-option>
  </el-select>
<!-- </span> -->
</template>
<script lang='ts'>
import { computed } from 'vue';

export default {
  props: {
    PropValue: {},
    InputContent: { // 选项列表
      type: String,
      default: '',
    },
    Allow: { // 是否允许自定义
      type: Boolean,
      default: false,
    },
    UpdateData: {
      type: Function,
      default: () => [],
    },
  },
  setup(props, context) {
    const inpVal = computed({
      get() {
        return props.PropValue;
      },
      set(value) {
        props.UpdateData(value);
      },
    });
    const getNumberValueList = (valueList) => {
      const reg = /\s|,|，/;
      return valueList.split(reg).filter(it => it);
    };
    const options = computed(() => {
      if (!props.InputContent) return [];
      return getNumberValueList(props.InputContent);
    });

    return {
      inpVal,
      options,
    };
  },
};
</script>
