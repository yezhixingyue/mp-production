<template>
  <el-dialog
    v-model="dialogVisible"
    :width="width"
    custom-class='mp-common-dialog'
    @close="Close"
    @closed="closed"
    :top="top">
    <template #header>
      <slot name="header">
        <p>
          {{title}}
        </p>
      </slot>
    </template>
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #footer>
      <slot name="footer">
        <el-button type="primary" v-if="showPrimary"
        @click="Primary">{{primaryText}}</el-button>
        <el-button type="danger" v-if="showDel" @click="Del">{{delBtnText }}</el-button>
        <el-button v-if="showClose" @click="Close">{{closeBtnText}}</el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
    },
    top: {
      type: String,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    showPrimary: {
      type: Boolean,
      default: true,
    },
    showDel: {
      type: Boolean,
      default: false,
    },
    primaryText: {
      type: String,
      default: '保存',
    },
    closeBtnText: {
      type: String,
      default: '取消',
    },
    delBtnText: {
      type: String,
      default: '删除',
    },
    primaryClick: {
      type: Function,
      default: () => null,
    },
    closeClick: {
      type: Function,
      default: () => null,
    },
    closed: {
      type: Function,
      default: () => null,
    },
  },
  setup(props, context) {
    const dialogVisible = computed({
      get() {
        return props.visible;
      },
      set(value) {
        if (value === props.visible) return;
        context.emit('update:visible', props.visible);
        console.log(props.visible);
      },
    });
    function Primary() {
      props.primaryClick();
    }
    function Del() {
      props.delClick();
    }
    function Close() {
      props.closeClick();
    }
    function closed() {
      props.closed();
    }
    return {
      Primary,
      Del,
      Close,
      dialogVisible,
    };
  },
};
</script>

<style lang="scss">
.mp-common-dialog{
  position: relative;
  .el-dialog__header{
    height: 40px;
    box-sizing: border-box;
    padding-top: 12px;
    padding-bottom: 12px;
    p{
      line-height: 16px;
      border-left: 3px solid #428DFA;
      padding-left: 20px;
    }
    .el-dialog__headerbtn{
      width: 56px;
      height: 40px;
      top: 0;
    }
    &::after{
      content: '';
      width: calc(100% - 20px);
      height: 1px;
      top: 40px;
      background-color: #EEEEEE;
      display: inline-block;
      position: absolute;
      left: 10px;
    }
  }
  .el-dialog__body{
    padding-top: 40px;
    padding-bottom: 20px;
  }
  .el-dialog__footer{
    padding-top: 20px;
    padding-bottom: 40px;
    text-align: center;
    .el-button{
      width: 120px;
      height: 35px;
    }
    .el-button+.el-button{
      margin-left: 20px;
    }
  }
}
</style>
