<template>
  <el-dialog
    v-model="dialogVisible"
    :width="width"
    class='mp-common-dialog'
    :class="{
      hideHeader: !showHeader,
      danger: danger,
      loading: loading,
    }"
    @close="Close"
    @closed="closedC"
    @open="onOpen"
    @opened="onOpened"
    :draggable="draggable"
    :modal="showModal"
    :append-To-Body="appendToBody"
    :destroy-on-close="destroyOnClose"
    :top="top"
    ref="oDialog"
    :show-close="!loading"
    :close-on-click-modal="closeOnClickModal">
    <template #header v-if="showHeader">
      <slot name="header">
        <p>
          {{title}}
        </p>
      </slot>
    </template>
    <template #default>
      <div class="close" v-if="!showHeader" @click="Close">
        <el-icon><Close /></el-icon>
      </div>
      <slot name="default"></slot>
    </template>
    <template #footer>
      <slot name="footer">
        <mp-button :type="danger ? 'danger' : 'primary'" class="gradient" v-if="showPrimary" :disabled="disabled || loading" ref="oSubmitBtn"
        @click="Primary">{{primaryText}}</mp-button>
        <mp-button type="danger" v-if="showDel" @click="Del" :disabled="loading">{{delBtnText }}</mp-button>
        <mp-button v-if="showClose" :class="danger ? 'pink' : 'blue'" @click="Close" :disabled="loading">{{closeBtnText}}</mp-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ElButton, ElDialog } from 'element-plus';
import { computed, ref } from 'vue';

export default {
  props: {
    draggable: {
      type: Boolean,
      default: true,
    },
    showModal: {
      type: Boolean,
      default: true,
    },
    autoSubmitFocus: {
      type: Boolean,
      default: false,
    },
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
    disabled: {
      type: Boolean,
      default: false,
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    danger: {
      type: Boolean,
      default: false,
    },
    loading: {
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
      if (props.loading) return;
      props.closeClick();
      if (props.autoClose) {
        dialogVisible.value = false;
      }
      context.emit('cancel');
    }

    const oDialog = ref<InstanceType<typeof ElDialog>>();

    function closedC() {
      // if (oDialog.value) {
      //   const el = oDialog.value.dialogContentRef?.$el as HTMLElement | undefined;

      //   if (el) {
      //     console.log('el.style.transform', el.style.transform);
      //     el.style.transform = '';
      //   }
      // }

      props.closed();
      context.emit('closed');
    }

    let initMarginTop = 0;

    function onOpen() {
      props.open();
      context.emit('open');
    }

    const oSubmitBtn = ref<InstanceType<typeof ElButton>>();
    const onOpened = () => {
      if (oDialog.value) {
        const el = oDialog.value.dialogContentRef?.$el as HTMLElement | undefined;

        if (el) {
          if (!initMarginTop) {
            initMarginTop = el.getBoundingClientRect().top;
          }

          const transformTop = el.style.transform.match(/translate\(-?\d+(\.\d+)?px, (-?\d+(\.\d+)?)px\)/)?.[2];

          if (transformTop && +transformTop < -initMarginTop) {
            el.style.transform = '';
          }
        }
      }
      if (props.autoSubmitFocus && !props.disabled && props.showPrimary && oSubmitBtn.value?.$el) {
        oSubmitBtn.value.$el.focus();
      }
    };

    return {
      oSubmitBtn,
      Primary,
      Del,
      onOpen,
      Close,
      closedC,
      onOpened,
      dialogVisible,
      oDialog,
    };
  },
};
</script>

<style lang="scss">
.mp-common-dialog{
  // position: relative;
  border-radius: 5px;
  .el-dialog__header{
    height: 40px;
    box-sizing: border-box;
    padding-top: 12px;
    padding-bottom: 12px;
    position: relative;
    p{
      line-height: 16px;
      border-left: 3px solid #26bcf9;
      padding-left: 16px;
      color: #888E99;
      font-size: 14px;
      text-align: left;
    }
    .el-dialog__headerbtn{
      width: 56px;
      height: 40px;
      top: 2px;
      right: -20px;
    }
    &::after{
      content: '';
      width: calc(100% - 2px);
      height: 1px;
      // top: 40px;
      background-color: #EEEEEE;
      display: inline-block;
      position: absolute;
      left: 10px;
      bottom: 0;
    }
  }
  .el-dialog__body{
    padding-top: 40px;
    padding-bottom: 20px;
    .close {
      position: absolute;
      right: 0px;
      top: 0;
      width: 34px;
      height: 30px;
      text-align: center;
      padding-top: 9px;
      box-sizing: border-box;
      cursor: pointer;
      i {
        transition: 0.15s ease-in-out;
      }
      &:hover {
        i {
          color: #26bcf9;
        }
      }
    }
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

  &.hideHeader {
    .el-dialog__header {
      display: none;
    }
  }

  &.danger {
    .el-dialog__header p {
      border-color: #ff3769;
    }
    .el-textarea, .el-input {
      --el-input-focus-border-color: #ff3769;
    }
  }
  &.loading {
    .el-dialog__footer {
      visibility: hidden;
    }
  }
}
</style>
