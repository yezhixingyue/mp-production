<template>
  <ul class="mp-tow-level-radio-group">
    <li>
      <el-radio-group v-model="Data.level1" @change="lv1SelectChange">
        <el-radio-button v-for="item in level1Options" :key="item[defaultProps.value]"
        :label="item[defaultProps.value]">
          <el-tooltip
            class="box-item"
            effect="dark"
            :disabled="item[defaultProps.label].length<7"
            :content="item[defaultProps.label]"
            placement="top"
          >
            {{item[defaultProps.label]}}
          </el-tooltip>
        </el-radio-button>
      </el-radio-group>
    </li>
    <li v-if="Data.level1">
      <el-radio-group v-model="Data.level2" @change="lv2SelectChange">
        <el-radio-button v-for="item in level2Options" :key="item[computedLv2DefaultProps.value]"
        :label="item[computedLv2DefaultProps.value]">
          <el-tooltip
            class="box-item"
            effect="dark"
            :disabled="item[computedLv2DefaultProps.label].length<6"
            :content="item[computedLv2DefaultProps.label]"
            placement="top"
          >
            {{item[computedLv2DefaultProps.label]}}
          </el-tooltip>
        </el-radio-button>
      </el-radio-group>
    </li>
  </ul>

</template>

<script lang='ts'>
import { computed, reactive, watch } from 'vue';

export default {
  props: {
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
  },
  setup(props, context) {
    const Data = reactive({
      level1: '',
      level2: '',
    });

    watch(() => props.value.level1Val, (newVal) => {
      Data.level1 = newVal;
    });
    watch(() => props.value.level2Val, (newVal) => {
      Data.level2 = newVal;
    });
    const computedLv2DefaultProps = computed(() => props.lv2DefaultProps || props.defaultProps);

    function emitChange(data) {
      context.emit('change', data);
      context.emit('requestFunc');
    }
    function lv1SelectChange(params) {
      emitChange({
        level1Val: params,
        level2Val: props.isAssociated ? '' : Data.level2,
      });
    }
    function lv2SelectChange(params:number) {
      emitChange({
        level1Val: Data.level1,
        level2Val: params,
      });
    }
    return {
      Data,
      computedLv2DefaultProps,
      lv1SelectChange,
      lv2SelectChange,
    };
  },

};
</script>
<style lang='scss'>
.mp-tow-level-radio-group{
  li+li{
    margin-top: 20px;
  }
  .el-radio-group{
    margin-left: 1px;
    margin-top: 1px;
  }
  .el-radio-button:last-child .el-radio-button__inner{
    border-radius: 0;
  }
  .el-radio-button:first-child .el-radio-button__inner{
    border-radius: 0;
  }
  .el-radio-button{
    width: 120px;
    height: 29px;
    margin-left: -1px;
    margin-top: -1px;
    overflow: hidden;
    box-sizing: border-box;
    &.is-active{
      border: none;
      .el-radio-button__inner{
        height: 100%;
      }
    }
    .el-radio-button__inner{
      .el-tooltip__trigger{
        display: inline-block;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 15px;
      }
      padding: 5px 15px;
      width: 120px;
      overflow: hidden;
      border-left: 1px solid rgb(220, 223, 230);
    }
  }
  .box-item{
    .el-radio-button{
      .el-radio-button__inner{
        overflow: hidden;
      }
    }
  }
}
</style>
