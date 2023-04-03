<template>
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
    const inpVal = computed({
      get() {
        if (props.InputContent) {
          return String(props.PropValue === null ? '' : props.PropValue);
        }
        return props.PropValue;
      },
      set(value) {
        if (value === '00000000-0000-0000-0000-000000000000') {
          props.UpdateData('');
        } else {
          props.UpdateData((value));
        }
      },
    });
    const getNumberValueList = (valueList) => {
      const reg = /\s|,|，/;
      return valueList.split(reg).filter(it => it).map(it => ({
        label: String(it),
        value: String(it),
      }));
    };
    const options = computed(() => {
      if (!props.InputContent) return [];
      if (!props.IsRequired) {
        return [{
          label: '请选择',
          value: '00000000-0000-0000-0000-000000000000',
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
