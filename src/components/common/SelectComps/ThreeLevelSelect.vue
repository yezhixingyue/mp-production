<template>
          <!-- <ThreeLevelSelect
            :title='"三级"'
            :level1Options='Data.options'
            :level2Options='Data.options2'
            :level3Options='Data.options3'
            :defaultProps="{
              label:'name',
              value:'age',
            }"
            :value='Data.twoSelecValue'
            @change="twoSelectChange"
            ></ThreeLevelSelect> -->
  <ul class="mp--three-level-select">
    <li class="text" v-if="title">
      <span>{{title}}：</span>
    </li>
    <li class="select-box first-select-box ">
      <OneLevelSelect
        :value="level1"
        :options="level1Options"
        @change="lv1SelectChange"
        :defaultProps="defaultProps"
        :showLine="showLine"
        :width="width"
      ></OneLevelSelect>
    </li>
    <li class="select-box">
      <OneLevelSelect
        :value="level2"
        :options="level2Options"
        @change="lv2SelectChange"
        :defaultProps="lv2DefaultProps || defaultProps"
        :showLine="showLine"
        :width="width"
      ></OneLevelSelect>
    </li>
    <li class="select-box">
      <OneLevelSelect
        :value="level3"
        :options="level3Options"
        @change="lv3SelectChange"
        :defaultProps="lv3DefaultProps || defaultProps"
        :showLine="showLine"
        :width="width"
      ></OneLevelSelect>
    </li>
  </ul>

</template>

<script lang='ts'>
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import { computed } from 'vue';

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    level1Options: {
      type: Array,
      default: () => ([]),
    },
    level2Options: {
      type: Array,
      default: () => ([]),
    },
    level3Options: {
      type: Array,
      default: () => ([]),
    },
    defaultProps: {
      type: Object,
      default: () => ({ label: 'Name', value: 'ID' }),
    },
    lv2DefaultProps: {
      type: Object,
      default: null,
    },
    lv3DefaultProps: {
      type: Object,
      default: null,
    },
    value: {
      type: Object,
      default: () => ({ level1Val: '', level2Val: '', level3Val: '' }),
    },
    isAssociated: { // 2级分类关联 第一个改变时清除第二个内容
      type: Boolean,
      default: true,
    },
    showLine: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 100,
    },
  },
  components: {
    OneLevelSelect,
  },
  setup(props, context) {
    let level2;
    let level3;
    const level1 = computed({
      get() {
        return props.value.level1Val;
      },
      set(newVal) {
        if (props.value.level1Val === newVal) return;
        context.emit('change', {
          level1Val: newVal,
          level2Val: props.isAssociated ? '' : level2.value,
          level3Val: props.isAssociated ? '' : level3.value,
        });
      },
    });

    level2 = computed({
      get() {
        return props.value.level2Val;
      },
      set(newVal) {
        context.emit('change', {
          level1Val: level1.value,
          level2Val: newVal,
          level3Val: props.isAssociated ? '' : level3.value,
        });
      },
    });
    level3 = computed({
      get() {
        return props.value.level3Val;
      },
      set(newVal) {
        context.emit('change', {
          level1Val: level1.value,
          level2Val: level2.value,
          level3Val: newVal,
        });
      },
    });

    function lv1SelectChange(params) {
      level1.value = params;
    }
    function lv2SelectChange(params:number) {
      level2.value = params;
    }
    function lv3SelectChange(params:number) {
      level3.value = params;
    }
    return {
      level1,
      level2,
      level3,
      lv1SelectChange,
      lv2SelectChange,
      lv3SelectChange,
    };
  },

};
</script>
<style lang='scss'>
.mp--three-level-select{
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
  >.select-box+.select-box {
    margin-left: 20px;
  }
}
</style>
