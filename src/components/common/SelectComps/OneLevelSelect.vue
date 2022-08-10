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
    <li class="select-box first-select-box ">
      <el-select
        v-model="result"
        placeholder="Select"
        :filterable='filterable'
        :style="`width:${width}px`">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item[defaultProps.label]"
          :value="item[defaultProps.value]"
        />
      </el-select>
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    value: {
      default: '不限',
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 100,
    },
    options: {
      type: Array,
      default: () => [{
        value: '',
        label: '不限',
      }],
    },
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'label',
        value: 'value',
      }),
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    showLine: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  setup(props, context) {
    const result = computed({
      get() {
        return props.value;
      },
      set(newVal) {
        if (newVal === props.value) return;
        context.emit('change', newVal);
      },
    });
    return {
      result,
    };
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-one-level-select {
  display: flex;
  line-height: 30px;
  >.text{
    text-align: right;
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
