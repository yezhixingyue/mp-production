<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="580"
    @cancel="localVisible = false"
    @submit="submit"
    @close="onClose"
    autoSubmitFocus
    :primaryText="displayInfo?.title || ''"
    class="mp-client-equipment-receive-result-handler-dialog-wrap"
    top="20vh"
    :showClose="false"
    title="交接提醒"
    >
    <div class="dialog-content" v-if="result">
      <p>
        <span>任务ID：</span>
        <span class="is-bold">{{ result.TaskCode || '' }}</span>
      </p>
      <p class="is-bold">
        <span>{{ result.TargetType === TargetTypeEnum.Plate ? '大版ID：' : 'ID' }}</span>
        <span>{{ result.TargetCode || '' }}</span>
      </p>
      <p class="ft-18 is-bold mb-10">
        <span class="mr-10">{{ result.Material || '' }}</span>
        <span v-if="result.Size" class="mr-2">{{ result.Size}}，</span>
        <span>{{ result.Number }}{{ result.Unit || '' }}</span>
        <span v-if='result.CurrentKind' class="ml-8">共{{ result.KindCount }}款，当前为第<i class="is-pink ft-20 ml-5 mr-5">{{ result.CurrentKind }}</i>款</span>
      </p>

      <p v-if="displayInfo?.tips" style="color: #ff3769;font-size: 16px;">{{ displayInfo?.tips }}</p>

      <!-- 不需要确认 -->
      <template v-if="!isConfirm">
        <div class="title" >
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

        <h4 class="third" v-if="!isCancel && !isError && displayInfo?.third && isBatchReport">{{ displayInfo.third }}</h4>

        <div class="red" v-if="displayInfo?.rightPosition">
          <span>请送往</span>
          <h2>{{ displayInfo.rightPosition }}</h2>
      </div>
      </template>

      <!-- 块报工 待确认处理 -->
      <div v-else class="confirm">
        <h3>加工数量<i class="is-success">{{ result.Number }}</i>{{ result.Unit || '' }}</h3>
        <h3>
          <span class="mr-13">当前块<i class="is-pink">{{ result.CurrentNumber }}</i>{{ result.Unit || '' }}</span>
          <span>已送达<i  class="is-success">{{ result.HaveSendNumber }}</i>{{ result.Unit || '' }}</span>
        </h3>
      </div>

      <img src="../../../assets/images/split-img.png" class="split-img" alt="" v-if="result.IsSplitPlate">
    </div>

    <template #footer v-if="isConfirm">
      <mp-button type="primary" class="gradient" @click="onSendConfirmClick(true)">送达当前块</mp-button>
      <mp-button type="danger" class="gradient" @click="onSendConfirmClick(false)">{{ result?.IsSplitPlate ? '送达此版块' : '全部送达' }}</mp-button>
    </template>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IReceiveResult } from '@/views/ProductionClient/assets/js/types';
import { EquipmentReceiveCodeEnum } from '@/views/ProductionClient/assets/js/enum';
import { TargetTypeEnum } from '@/views/ExceptionManage/_ExceptionCommonViews/SetupView/js/enum';

const props = defineProps<{
  visible: boolean
  result: IReceiveResult | null
  isBatchReport: boolean // 是否批量报工
}>();

const emit = defineEmits(['update:visible', 'close', 'submit', 'confirm']);

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

const isConfirm = computed(() => !!(props.result && props.result.Code === EquipmentReceiveCodeEnum.NeedConfirm));

const displayInfo = computed(() => {
  if (!props.result) return null;
  const temp = {
    title: '',
    first: '',
    second: '',
    third: '', // 可生产 | 不可生产
    rightPosition: '',
    class: '',
    tips: '',
  };

  switch (props.result.Code) {
    case EquipmentReceiveCodeEnum.OK:
      temp.title = '确定';
      temp.first = '位置正确，';
      temp.second = '完成送达';
      temp.tips = props.result.Tips || '';
      // 都不记得当初为什么要添加此处文字 暂时予以注释 25.6.26
      // temp.third = props.result.Status === ProductiveTaskStatusEnum.Producibility ? '可生产' : '不可生产';
      // temp.class = 'is-success';
      break;

    case EquipmentReceiveCodeEnum.CurrentTask:
      temp.title = '确定';
      temp.first = '正确：';
      temp.second = '是当前加工任务';
      // temp.third = props.result.Status === ProductiveTaskStatusEnum.Producibility ? '可生产' : '不可生产';
      temp.class = 'is-success';
      break;

    case EquipmentReceiveCodeEnum.UnCurrentTask:
      temp.title = '关闭';
      temp.first = '';
      temp.second = '重复扫描';
      // temp.class = 'is-pink';
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

const onSendConfirmClick = (OnlyCurrent: boolean) => {
  localVisible.value = false;

  const temp = { OnlyCurrent };
  emit('confirm', temp);
};
</script>

<style lang='scss' scoped>
.dialog-content {
  margin-top: -25px;
  padding: 0 20px;
  font-size: 16px;
  color: #444;

  > p {
    line-height: 27px;
    margin-bottom: 4px;

    &.mb-10 {
      margin-bottom: 10px;
    }
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
      font-size: 80px;
      margin-right: 10px;
    }
    > div {
      h1 {
        font-size: 30px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        line-height: 38px;
      }
    }
  }

  > .third {
    text-align: center;
    margin-top: 25px;
    font-size: 17px;
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

  .split-img {
    position: absolute;
    right: 55px;
    width: 138px;
    height: 138px;
    bottom: 6px;
  }

  .confirm {
    text-align: center;
    font-size: 25px;
    h3 {
      margin-bottom: 5px;
      white-space: nowrap;
      margin: 0 -30px;
      i {
        font-size: 34px;
        margin: 0 5px;
      }
    }
  }

  .is-success {
    color: #52C41A;
  }
  .is-pink {
    color: #FF3E6A;
  }
  .is-orange {
    color: #F4A307;
  }
}
</style>

<style lang="scss">
.mp-client-equipment-receive-result-handler-dialog-wrap {
  .el-dialog__body {
    min-height: 200px;
    position: relative;
  }
  .el-dialog__footer {
    padding-top: 10px;
  }
}
</style>
