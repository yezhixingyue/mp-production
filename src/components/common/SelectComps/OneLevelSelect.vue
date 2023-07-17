<template>
          <!-- <OneLevelSelect
            :value="Data.SelecValue"
            title="物料筛选"
            :options="Data.options"
            @change="SelectChange"
            :defaultProps="{
              label:'name',
              value:'age',
            }"
          ></OneLevelSelect> -->
  <ul class="mp-one-level-select">
    <li class="text" v-if="title">
      <span>{{title}}：</span>
    </li>
    <li class="select-box first-select-box" :class="{'show-line':showLine}">
      <el-select
        v-model="result"
        :placeholder="placeholder"
        :filterable='filterable'
        no-data-text="无数据"
        :disabled="disabled"
        :style="`width:${width}px`">
        <el-option
          v-for="item in options"
          :key="item[defaultProps.value]"
          :label="item[defaultProps.label]"
          :value="item[defaultProps.value]"
        />
      </el-select>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface defaultPropsType {
  [a:string]:string|number,
}

interface Props {
  value: string|number|null|undefined
  placeholder?: string
  title?: string
  width?: number
  options?: defaultPropsType[]
  defaultProps?: defaultPropsType
  filterable?: boolean
  showLine?: boolean
  disabled?:boolean
}
const emit = defineEmits(['change', 'requestFunc']);

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  placeholder: '请选择',
  title: '',
  width: 100,
  options: () => [{
    label: '',
    value: '不限',
  }],
  defaultProps: () => ({
    label: 'label',
    value: 'value',
  }),
  filterable: false,
  showLine: false,
  disabled: false,
});
const result = computed({
  get() {
    return props.value;
  },
  set(newVal) {
    if (newVal === props.value) return;
    emit('change', newVal);
    emit('requestFunc', newVal);
  },
});

// export default {
//   props: {
//     defaultProps: {
//       type: Object,
//       default: () => ({
//         label: 'label',
//         value: 'value',
//       }),
//     },
//   },
//   model: {
//     prop: 'value',
//     event: 'change',
//   },
//   setup(props, context) {
//     return {
//       result,
//     };
//   },
// };
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-one-level-select {
  display: flex;
  line-height: 30px;
  >.text{
    font-weight: 600;
    text-align: right;
  }
  .show-line {
    border-radius: 0;
    .el-input__wrapper{
      box-shadow: 0px 1px 0px var(--el-input-border-color)!important;
      border-radius: 0;
    }
    .el-input__wrapper:hover {
      box-shadow: none;
      box-shadow: 0px 1px 0px var(--el-input-hover-border-color)!important;
    }
    .el-select .el-input.is-focus .el-input__wrapper{
      box-shadow: 0px 1px 0px var(--el-select-input-focus-border-color) !important;
    }
    .el-select .el-input__wrapper.is-focus{
      box-shadow: none !important;
      box-shadow: 0px 1px 0px var(--el-select-input-focus-border-color)!important;
    }
  }
  .el-select {
    box-sizing: border-box;
    line-height: 30px;
    height: 30px;
    .select-trigger{
      line-height: 30px;
      height: 30px;
      .el-input{
        line-height: 30px;
        height: 30px;
      }
    }
  }
}
</style>
