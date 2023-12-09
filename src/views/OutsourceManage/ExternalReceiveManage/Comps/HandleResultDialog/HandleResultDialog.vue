<template>
 <DialogContainerComp
   :visible='localVisible'
   :width='600'
   :title="isInstored ? '外协加工入库' : '外协加工出库'"
   top='12vh'
   @open='onOpen'
   @cancel='close'
   class="handle-result-dialog"
   >
   <div class='dialog-content'>
    <!-- 外协任务详情展示 -->
    <ExTaskDetail :result="result" v-if="result" :class="{
      'd-writeQuestion': displayMode.writeQuestion,
      'd-confirming': displayMode.confirming,
    }" />

    <div class="handle-content">
      <!-- 第一次扫描 确认完成 --- 不用展示内容 -->

      <!-- 重复扫描 已确认 -->
      <div v-if="displayMode.confirmed" class="confirmed">
        <h2>重复扫描</h2>
        <div class="title">
          <el-icon><SuccessFilled /></el-icon>
          <h4>此外协任务已确认完成</h4>
        </div>
        <mp-button link type="primary" @click="isSettingError = true" v-if="isInstored">外协有问题</mp-button>
      </div>

      <!-- 重复扫描 已上报问题 -->
      <div v-if="displayMode.setErrored" class="setErrored">
        <h2>重复扫描</h2>
        <div class="title">
          <el-icon><CircleCloseFilled /></el-icon>
          <h4>此外协任务 已上报问题</h4>
        </div>
        <div class="remark">
          <span>问题描述：</span>
          <span>{{ result?.Exception || '' }}</span>
        </div>
      </div>

      <!-- 问题提交 -->
      <div v-if="displayMode.writeQuestion" class="writeQuestion">
        <span>问题描述：</span>
        <el-input v-model.trim="remark" :rows="6" maxlength="100" type="textarea" />
      </div>
    </div>
   </div>
   <template #footer>
    <div class="btns">
      <!-- 第一次扫描 确认完成 -->
      <template v-if="displayMode.confirming">
        <mp-button type="primary" @click="submit">{{ isInstored ? '确认完成' : '确认送出' }}</mp-button>
        <mp-button class="blue" @click="isSettingError = true" v-if="isInstored">有问题</mp-button>
        <mp-button class="blue" @click="close" v-else>关闭</mp-button>
      </template>

      <!-- 重复扫描 已确认 -->
      <template v-if="displayMode.confirmed">
        <mp-button class="blue" @click="close">关闭</mp-button>
      </template>

      <!-- 重复扫描 已上报问题 -->
      <template v-if="displayMode.setErrored">
        <mp-button class="blue" @click="close">关闭</mp-button>
      </template>

      <!-- 问题提交 -->
      <template v-if="displayMode.writeQuestion">
        <mp-button type="primary" @click="submitError">保存</mp-button>
        <mp-button class="blue" @click="isSettingError = false">返回</mp-button>
      </template>
    </div>
   </template>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import ExTaskDetail from './ExTaskDetail.vue';
import { IExternalReportResult } from '../../js/types';
import { ExternalReportResultCodeEnum } from '../../js/enums';

const props = defineProps<{
  visible: boolean
  result: IExternalReportResult | null
  isInstored: boolean
}>();

const emit = defineEmits(['update:visible', 'submit', 'setQuestion', 'close']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const isSettingError = ref(false);

const displayMode = computed(() => ({
  /** 提交问题 */
  writeQuestion: isSettingError.value,
  /** 确认完成 */
  // eslint-disable-next-line no-unneeded-ternary
  confirming: isSettingError.value ? false : props.result?.Code === ExternalReportResultCodeEnum.Success, // 三元运算符最后一项为根据结果数据判断出来的布尔值，下方2项同此
  /** 已确认完成 */
  // eslint-disable-next-line no-unneeded-ternary
  confirmed: isSettingError.value ? false : props.result?.Code === ExternalReportResultCodeEnum.Repeated,
  /** 已提交问题 */
  // eslint-disable-next-line no-unneeded-ternary
  setErrored: isSettingError.value ? false : props.result?.Code === ExternalReportResultCodeEnum.HaveException,
}));

/** 问题描述 */
const remark = ref('');

const onOpen = () => {
  remark.value = '';
  isSettingError.value = false;
};

const close = () => {
  localVisible.value = false;
  emit('close');
};

const submitError = () => { // 问题提交
  if (!remark.value) {
    MpMessage.error('保存失败', '请输入问题描述');
    return;
  }

  emit('setQuestion', remark.value);
};

const submit = () => { // 确认完成
  emit('submit');
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.handle-result-dialog {
  .dialog-content {
    margin-top: -15px;
    min-height: 160px;
    max-height: 450px;
    overflow: auto;
    overflow: overlay;

    @include scroll;
  }
  .btns {
    button {
      width: 162px;
      height: 47px;
      font-size: 18px;
      & + button.el-button {
        margin-left: 70px;
      }
    }
  }

  .confirmed, .setErrored {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5px;
    > h2 {
      font-size: 30px;
      margin-top: 15px;
      margin-bottom: 6px;
      color: #444;
    }

    .title {
      display: flex;
      align-items: center;
      font-size: 32px;
      color: #52C41A;
      > h4 {
        width: 5em;
        margin-left: 10px;
      }
      > i {
        font-size: 75px;
      }
    }

    > button {
      font-size: 20px;
      margin-top: 10px;
    }
  }

  .writeQuestion {
    width: 500px;
    padding-left: 35px;
    padding-top: 20px;
    padding-bottom: 10px;
    > span {
      font-size: 18px;
      margin-bottom: 4px;
      display: block;
    }
  }

  .setErrored {
    .title {
      color: #D9001B;
      > i {
        color: #ff0000;
      }
    }

    .remark {
      font-size: 16px;
      display: flex;
      margin-top: 15px;
      line-height: 22px;
      > span:last-of-type {
        max-width: 310px;
      }
    }
  }
}

</style>
