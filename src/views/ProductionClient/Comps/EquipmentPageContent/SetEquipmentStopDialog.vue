<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="520"
    :title="title"
    @submit="submit"
    @cancel="onCancel"
    @closed="onClosed"
    top="20vh"
    :primary-text="requestResult ? '确定' : '报停'"
    :danger="!requestResult"
    :show-close="!requestResult"
    :show-header="!requestResult"
    class="mp-client-set-equipment-report-stop-dialog-comp-wrap"
    >
    <ErrorContent v-if="requestResult" :ErrorInfo="requestResult.ErrorInfo" />
    <div class="dialog-content" v-else>
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
import ErrorContent from './CurTaskPanel/EquipmentError/ErrorContent.vue';
import { IEquipmentErrorInfo } from '../../assets/js/types';

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

const title = computed(() => `设备报停：${ManageClientPageData.value.curActiveInstance?.Equipment.Name || ''}`);

const reason = ref(''); // 6 - 16位

const requestResult = ref<null | { ErrorInfo: IEquipmentErrorInfo; cb:() => void }>(null);

const onCancel = () => {
  if (requestResult.value) {
    requestResult.value.cb();
  }
  localVisible.value = false;
};

const onClosed = () => {
  reason.value = '';
  requestResult.value = null;
};

const submit = async () => {
  if (requestResult.value) {
    // 成功后的弹窗关闭处理
    onCancel();
    return;
  }
  if (!reason.value) {
    MpMessage.error({ title: '操作失败', msg: '请输入报停原因' });
    return;
  }
  if (ManageClientPageData.value.curActiveInstance) {
    const result = await ManageClientPageData.value.curActiveInstance.getEquipmentStop(reason.value);
    if (result) {
      requestResult.value = result;
    }
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
    padding-bottom: 35px;
    .el-button {
      height: 40px;
      width: 135px;
      font-size: 15px;
      border-radius: 3px;
    }
  }
}
</style>
