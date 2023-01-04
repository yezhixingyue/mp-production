<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="427"
    :showHeader="false"
    top="20vh"
    @submit="submit"
    @cancel="localVisible = false"
    primary-text="确定要置顶"
    class="mp-order-manage-set-order-top-dialog-comp-wrap"
    >
    <div class="top-content">
      <i class="iconfont icon-jinggao is-pink"></i>
      <h2>一键置顶将影响其他订单的出货工期请谨慎操作！！！</h2>
      <p class="tips-box">
        <el-icon><WarningFilled /></el-icon>
        <span>注：每个生产周期（12:00 至次日 12:00）仅可置顶3个订单，非紧急情况，请慎用</span>
      </p>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';

const props = defineProps<{
  visible: boolean
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const submit = () => {
  emit('submit');
  localVisible.value = false;
};

</script>

<style lang='scss'>
@import '@/assets/css/mixins.scss';

.mp-order-manage-set-order-top-dialog-comp-wrap {

  .top-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -32px;
    margin-bottom: -20px;

    .iconfont {
      font-size: 70px;
    }

    > h2 {
      color: #444;
      font-size: 17px;
      padding-left: 60px;
      padding-right: 55px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    }

    .tips-box {
      margin: 0 27px;
      margin-top: 10px;
      line-height: 18px;
      height: auto;
      letter-spacing: 1px;
    }
  }

  .el-dialog__footer {
    padding-bottom: 24px;
  }
}

</style>
