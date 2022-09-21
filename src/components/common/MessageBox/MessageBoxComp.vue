<template>
  <el-dialog
    v-model="dialogVisible"
    :width="width"
    custom-class='mp-message-box-comp-dialog'
    @close="CloseClick">
    <template #default>
      <slot name="header">
        <p>
          <i v-if="iconClass" :class="iconClass"></i>
          {{title}}
        </p>
      </slot>
      <slot name="default"></slot>
    </template>
    <template #footer>
      <slot name="footer">
        <mp-button type="primary" v-if="showPrimary"
        @click="PrimaryClick">{{primaryText}}</mp-button>
        <mp-button type="danger" v-if="showDel" @click="DelClick">{{delBtnText }}</mp-button>
        <mp-button v-if="showClose" @click="CloseClick">{{closeBtnText}}</mp-button>
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
  },
  setup(props, context) {
    const dialogVisible = computed({
      get() {
        return props.visible;
      },
      set(value) {
        if (value === props.visible) return;
        context.emit('update:visible', props.visible);
      },
    });
    function PrimaryClick() {
      context.emit('primaryClick');
    }
    function DelClick() {
      context.emit('delClick');
    }
    function CloseClick() {
      context.emit('closeClick');
    }
    return {
      PrimaryClick,
      DelClick,
      CloseClick,
      dialogVisible,
    };
  },
};
</script>

<style lang="scss">
.mp-message-box-comp-dialog{
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
