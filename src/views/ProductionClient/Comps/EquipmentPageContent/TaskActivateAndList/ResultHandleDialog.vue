<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="520"
    @cancel="localVisible = false"
    @submit="submit"
    @close="onClose"
    autoSubmitFocus
    :primaryText="displayInfo?.title || ''"
    class="mp-client-equipment-receive-result-handler-dialog-wrap"
    top="20vh"
    :showClose="false"
    :showHeader="false"
    >
    <div class="dialog-content" v-if="result">
      <p>
        <span>任务ID：</span>
        <span class="ft-18 is-bold">{{ result.TaskCode || '' }}</span>
      </p>
      <p>
        <span>大版ID：</span>
        <span class="ft-18 is-bold">{{ result.TargetCode || '' }}</span>
      </p>
      <p class="ft-18">
        <span class="mr-12">{{ result.Material || '' }}</span>
        <span>{{ result.Size || '' }}</span>
      </p>
      <h2 class="number">
        {{ result.Number }}{{ result.Unit || '' }}
      </h2>
      <div class="title">
        <el-icon v-if="isCancel" class="is-orange"><WarningFilled /></el-icon>
        <el-icon v-else-if="isError" class="is-pink"><CircleCloseFilled /></el-icon>
        <el-icon v-else class="is-success"><CircleCheckFilled /></el-icon>
        <div :class="displayInfo?.class">
          <h1>
            {{ displayInfo?.first }}
          </h1>
          <h1 v-if="displayInfo?.second">{{ displayInfo.second }}</h1>
        </div>
      </div>
      <div class="red" v-if="displayInfo?.rightPosition">
        <span>请送往</span>
        <h2>{{ displayInfo.rightPosition }}</h2>
      </div>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IReceiveResult } from '@/views/ProductionClient/assets/js/types';
import { EquipmentReceiveCodeEnum } from '@/views/ProductionClient/assets/js/enum';

const props = defineProps<{
  visible: boolean
  result: IReceiveResult | null
}>();

const emit = defineEmits(['update:visible', 'close', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const isError = computed(() => props.result && [EquipmentReceiveCodeEnum.ErrorPosition, EquipmentReceiveCodeEnum.UnCurrentTask].includes(props.result.Code));
const isCancel = computed(() => props.result && [EquipmentReceiveCodeEnum.HaveCancled].includes(props.result.Code));

const displayInfo = computed(() => {
  if (!props.result) return null;
  const temp = {
    title: '',
    first: '',
    second: '',
    rightPosition: '',
    class: '',
  };

  switch (props.result.Code) {
    case EquipmentReceiveCodeEnum.OK:
      temp.title = '确定';
      temp.first = '位置正确，';
      temp.second = '完成送达';
      temp.class = 'is-success';
      break;

    case EquipmentReceiveCodeEnum.CurrentTask:
      temp.title = '确定';
      temp.first = '正确：';
      temp.second = '是当前加工任务';
      temp.class = 'is-success';
      break;

    case EquipmentReceiveCodeEnum.UnCurrentTask:
      temp.title = '关闭';
      temp.first = '错误：';
      temp.second = '非当前加工任务';
      temp.class = 'is-pink';
      break;

    case EquipmentReceiveCodeEnum.ErrorPosition:
      temp.title = '关闭';
      temp.first = '位置错误';
      temp.second = '';
      temp.rightPosition = props.result.Message;
      temp.class = 'is-pink';
      break;

    case EquipmentReceiveCodeEnum.HaveCancled:
      temp.title = '关闭';
      temp.first = '该订单已取消';
      temp.second = props.result.Message;
      temp.class = 'is-orange';
      break;

    default:
      break;
  }

  return temp;
});

// 弹窗关闭时触发 - 用于提示外部进行输入框的焦点获取
const onClose = () => {
  const code = props.result ? props.result.Code : -777;
  emit('close');
  if (!isError.value || !isCancel.value) {
    emit('submit', code);
  }
};

const submit = () => {
  localVisible.value = false;
};

</script>

<style lang='scss' scoped>
.dialog-content {
  margin-top: -5px;
  padding: 0 20px;
  font-size: 16px;
  color: #444;
  > p {
    line-height: 22px;
    margin-bottom: 8px;
  }
  >.number {
    margin-bottom: 20px;
    font-weight: 400;
    font-size: 26px;
  }
  > .title {
    display: flex;
    align-items: center;
    justify-content: center;
    > i {
      font-size: 77px;
      margin-right: 10px;
    }
    > div {
      h1 {
        font-size: 30px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        line-height: 38px;
      }
    }
    .is-success {
      color: #52C41A;
    }
    .is-pink {
      color: #ff0000;
    }
    .is-orange {
      color: #F4A307;
    }
  }

  > .red {
    color: #ff0000;
    display: flex;
    align-items: center;
    font-size: 24px;
    flex-wrap: wrap;
    span {
      margin-right: 30px;
    }
    h2 {
      font-size: 30px;
    }
  }
}
</style>

<style lang="scss">
.mp-client-equipment-receive-result-handler-dialog-wrap {
  .el-dialog__body {
    min-height: 240px;
  }
  .el-dialog__footer {
    padding-top: 30px;
  }
}
</style>
