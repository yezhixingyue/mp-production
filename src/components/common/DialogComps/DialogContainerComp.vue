<template>
  <el-dialog
    v-model="dialogVisible"
    :width="width"
    class='mp-common-dialog'
    @close="Close"
    @closed="closedC"
    @open="onOpen"
    @opened="onOpened"
    draggable
    :append-To-Body="appendToBody"
    :top="top"
    :close-on-click-modal="closeOnClickModal">
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
        <mp-button type="primary" class="gradient" v-if="showPrimary"
        @click="Primary">{{primaryText}}</mp-button>
        <mp-button type="danger" v-if="showDel" @click="Del">{{delBtnText }}</mp-button>
        <mp-button v-if="showClose" class="blue" @click="Close">{{closeBtnText}}</mp-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts">
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
    delClick: {
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
    open: {
      type: Function,
      default: () => null,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    autoClose: { // 是否在点击取消或关闭时 自动关闭弹窗展示
      type: Boolean,
      default: false,
    },
  },
  emits: ['closed', 'open', 'opened', 'submit', 'cancel', 'update:visible', 'danger'],
  setup(props, context) {
    const dialogVisible = computed({
      get() {
        return props.visible;
      },
      set(value) {
        if (value === props.visible) return;
        context.emit('update:visible', value);
      },
    });
    function Primary() {
      props.primaryClick();
      context.emit('submit');
    }
    function Del() {
      props.delClick();
      context.emit('danger');
    }
    function Close() {
      props.closeClick();
      if (props.autoClose) {
        dialogVisible.value = false;
      }
      context.emit('cancel');
    }
    function closedC() {
      props.closed();
      context.emit('closed');
    }
    function onOpen() {
      props.open();
      context.emit('open');
    }

    const onOpened = () => {
      context.emit('opened');
    };

    return {
      Primary,
      Del,
      onOpen,
      Close,
      closedC,
      onOpened,
      dialogVisible,
    };
  },
};
</script>

<style lang="scss">
.mp-common-dialog{
  position: relative;
  border-radius: 5px;
  .el-dialog__header{
    height: 40px;
    box-sizing: border-box;
    padding-top: 12px;
    padding-bottom: 12px;
    p{
      line-height: 16px;
      border-left: 3px solid #26bcf9;
      padding-left: 16px;
      color: #888E99;
      font-size: 14px;
    }
    .el-dialog__headerbtn{
      width: 56px;
      height: 40px;
      top: 2px;
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
      margin-left: 30px;
    }
  }
}
</style>
