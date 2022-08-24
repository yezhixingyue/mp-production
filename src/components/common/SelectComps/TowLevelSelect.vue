<template>

  <ul class="mp--tow-level-select">
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
    <li class="select-box first-select-box ">
      <OneLevelSelect
        :value="level2"
        :options="level2Options"
        @change="lv2SelectChange"
        :defaultProps="lv2DefaultProps || defaultProps"
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
    defaultProps: {
      type: Object,
      default: () => ({ label: 'Name', value: 'ID' }),
    },
    lv2DefaultProps: {
      type: Object,
      default: null,
    },
    value: {
      type: Object,
      default: () => ({ level1Val: '', level2Val: '' }),
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
    const level1 = computed({
      get() {
        return props.value.level1Val;
      },
      set(newVal) {
        if (props.value.level1Val === newVal) return;
        context.emit('change', {
          level1Val: newVal,
          level2Val: props.isAssociated ? '' : level2.value,
        });
        context.emit('requestFunc');
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
        });
        context.emit('requestFunc');
      },
    });

    function lv1SelectChange(params) {
      level1.value = params;
    }
    function lv2SelectChange(params:number) {
      level2.value = params;
    }
    return {
      level1,
      level2,
      lv1SelectChange,
      lv2SelectChange,
    };
  },

};
</script>
<style lang='scss'>
.mp--tow-level-select{
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
