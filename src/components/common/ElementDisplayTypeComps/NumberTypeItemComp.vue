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
    @keyup="keyup"
    class="mp-erp-number-type-element-display-select-comp">
    <el-option
      v-for="(item,index) in options"
      :key="item + '-' + index"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>
<script lang='ts' setup>
import {
  computed, ref, Ref,
} from 'vue';

const props = defineProps<{
  PropValue:string|null,
  InputContent:string,
  Allow:boolean,
  AllowDecimal:boolean,
  UpdateData:(val:string|number|null) => void,
  IsRequired:boolean,
}>();
const oSelect = ref<Ref|null>(null);
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

const keyup = (E) => {
  const val = E.target.value;
  const temp = options.value?.find(it => it.label === val);
  if (temp) {
    inpVal.value = temp.value;
  } else {
    inpVal.value = E.target.value;
  }
};
const blur = () => {
  oSelect.value?.blur();
};
defineExpose({
  blur,
});

</script>
