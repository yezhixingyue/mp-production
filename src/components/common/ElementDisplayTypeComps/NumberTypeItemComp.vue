<template>
<!-- <span> -->
  <el-input-number v-if="!InputContent" placeholder="请输入" :controls="false"
  v-model="inpVal" :step="0.01"/>
  <!-- <el-input type="number" placeholder="请输入" v-if="!InputContent" v-model="inpVal" /> -->
  <el-select
    v-if="InputContent"
    v-model="inpVal"
    :filterable='Allow'
    default-first-option
    :allow-create='Allow'
    no-data-text="无数据"
    placeholder="请选择"
    ref="oSelect"
    class="mp-erp-number-type-element-display-select-comp">
    <el-option
      v-for="(item,index) in options"
      :key="item + '-' + index"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
<!-- </span> -->
</template>
<script lang='ts'>
import { computed, WritableComputedRef } from 'vue';

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
    AllowDecimal: { // 是否允许小数
      type: Boolean,
      default: false,
    },
    UpdateData: {
      type: Function,
      default: () => [],
    },
    IsRequired: { // 是否必填
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const inpVal:WritableComputedRef<number> = computed({
      get() {
        return props.PropValue as number;
      },
      set(value) {
        props.UpdateData(value);
      },
    });
    const getNumberValueList = (valueList) => {
      const reg = /\s|,|，/;
      return valueList.split(reg).filter(it => it).map(it => ({
        label: Number(it),
        value: Number(it),
      }));
    };
    const options = computed(() => {
      if (!props.InputContent) return [];
      if (!props.IsRequired) {
        return [{
          label: '无',
          value: null,
        }, ...getNumberValueList(props.InputContent)];
      }
      return getNumberValueList(props.InputContent);
    });
    return {
      inpVal,
      options,
    };
  },
};
</script>
