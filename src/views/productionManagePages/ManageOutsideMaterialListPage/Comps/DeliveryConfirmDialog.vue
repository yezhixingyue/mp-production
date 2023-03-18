<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="380"
    :showHeader="false"
    top="220px"
    @submit="submit"
    @cancel="localVisible = false"
    primary-text="确定到货"
    class="mp-outside-material-manage-set-item-delivery-confirm-dialog-comp-wrap"
    >
    <div class="top-content">
      <el-icon class="is-orange"><WarningFilled /></el-icon>
      <h2>到货操作不能撤回，请谨慎操作！！！</h2>
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

.mp-outside-material-manage-set-item-delivery-confirm-dialog-comp-wrap {

  .top-content {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -12px;
    margin-bottom: -10px;

    i {
      font-size: 60px;
    }

    > h2 {
      color: #444;
      font-size: 17px;
      padding-left: 20px;
      width: 168px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    }
  }

  .el-dialog__footer {
    padding-bottom: 26px;
  }
}

</style>
