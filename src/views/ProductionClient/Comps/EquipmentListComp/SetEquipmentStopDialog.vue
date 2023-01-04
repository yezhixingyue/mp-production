<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="520"
    title="设备报停:"
    @submit="submit"
    @cancel="localVisible = false"
    @closed="onClosed"
    top="20vh"
    primary-text="报停"
    class="mp-client-set-equipment-report-stop-dialog-comp-wrap"
    >
    <div class="dialog-content">
      <h2>报停原因：</h2>
      <el-input v-model.trim="reason" autocomplete="off" maxlength="20" show-word-limit></el-input>
      <p class="tips-box">
        <el-icon><WarningFilled /></el-icon>
        <span>注：报停后所未完成工单将重新分配生产机器，请谨慎操作！</span>
      </p>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ManageClientPageData } from '@/api/client/clientStore';

const props = defineProps<{
  visible: boolean
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const reason = ref(''); // 6 - 16位

const onClosed = () => {
  reason.value = '';
};

const submit = () => {
  if (!reason.value) {
    MpMessage.error({ title: '操作失败', msg: '请输入报停原因' });
    return;
  }
  if (ManageClientPageData.value.curActiveInstance) {
    const cb = () => {
      localVisible.value = false;
    };
    ManageClientPageData.value.curActiveInstance.reportStop(reason.value, cb);
  }
};

</script>

<style lang='scss'>
.mp-client-set-equipment-report-stop-dialog-comp-wrap {
  .el-dialog__body {
    padding: 25px 40px 5px;
    .dialog-content {
      color: #444;
      h2 {
        font-size: 17px;
        margin-bottom: 8px;
      }
      .el-input {
        height: 40px;
        font-size: 15px;
      }
      .tips-box {
        margin-top: 32px;
        font-size: 14px;
        padding-left: 15px;
        i {
          margin-right: 10px;
        }
      }
    }
  }
  .el-dialog__footer {
    padding-bottom: 20px;
    .el-button {
      height: 40px;
      width: 135px;
      font-size: 15px;
      border-radius: 3px;
    }
  }
}
</style>
