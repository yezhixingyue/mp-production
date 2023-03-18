<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="580"
    title="报错"
    @cancel="localVisible = false"
    @submit="submit"
    @open="onOpen"
    primaryText="报错"
    class="mp-client-set-task-error-dialog-wrap"
    top="20vh"
    danger
    >
    <ul class="dialog-content" v-if="TaskData && localInfo">
      <!-- ID -->
      <li v-if="TaskData.Working.ReportMode === ReportModeEnum.board && TaskData.Working.PlateInfo">
        <span class="label">大版ID：</span>
        <h4>{{ TaskData.Working.PlateInfo.Code }}</h4>
      </li>
      <li v-if="TaskData.Working.ReportMode !== ReportModeEnum.board && TaskData.Working.OrderInfo">
        <span class="label">订单ID：</span>
        <span class="mr-5">{{ TaskData.Working.OrderInfo.ServerName }}</span>
        <h4>{{ TaskData.Working.OrderInfo.OrderID }}</h4>
      </li>
      <!-- 标题 -->
      <li class="title">
        <div class="l">
          <div>
            <span class="f" v-if="localInfo.FirstTitle">
              {{ localInfo.FirstTitle }}
            </span>
            <h4 v-if="TaskData.Working.ReportMode === ReportModeEnum.block && TaskData.Working.ChunkInfo?.Name">
              {{ TaskData.Working.ChunkInfo.Name }}
            </h4>
          </div>
          <p v-if="localInfo.SecondTitle">{{ localInfo.SecondTitle }}</p>
        </div>
        <p class="r">
          {{ TaskData.UnFinishNumber }}{{ localInfo.Unit }}
        </p>
      </li>
      <!-- 输入文字区域 -->
      <li class="input-area">
        <h4>情况说明：</h4>
        <el-input v-model.trim="textarea" :rows="4" type="textarea" maxlength="80" show-word-limit />
        <p class="tips-box">
          <el-icon><WarningFilled /></el-icon>
          <span>注：报错后，该任务往后工序会被全部暂停。请谨慎操作！</span>
        </p>
      </li>
    </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { getTaskDisplayInfo } from '.';

const props = defineProps<{
  visible: boolean
  TaskData: ITaskDetail | null,
}>();

const emit = defineEmits(['update:visible', 'setError']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const localInfo = computed(() => (props.TaskData ? getTaskDisplayInfo(props.TaskData, false) : null));

const textarea = ref('');

const onOpen = () => {
  textarea.value = '';
};

const submit = () => {
  if (!textarea.value) {
    MpMessage.error({ title: '操作失败', msg: '请输入情况说明' });
    return;
  }

  emit('setError', textarea.value);
};

</script>

<style lang='scss' scoped>
.dialog-content {
  margin-top: -30px;
  padding: 0 20px;
  font-size: 16px;
  font-family: Microsoft YaHei UI-Regular, Microsoft YaHei UI;
  color: #444;

  > li {
    display: flex;
    font-family: Microsoft YaHei UI-Regular, Microsoft YaHei UI;
    &.title {
      margin-top: 15px;
      line-height: 22px;
      align-items: center;
      .l {
        flex: 1;
        font-size: 18px;
        margin-right: 20px;
      }
      .r {
        font-size: 26px;
      }
    }

    &.input-area {
      flex-direction: column;
      margin-top: 20px;
      h4 {
        font-size: 14px;
        margin-bottom: 6px;
      }

      .tips-box {
        font-size: 14px;
        letter-spacing: 0.5px;
        margin-top: 20px;
        white-space: nowrap;
        i {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.mp-client-set-task-error-dialog-wrap {
  .el-dialog__footer {
    padding-top: 5px;
    padding-bottom: 24px;
    .el-button {
      height: 47px;
      width: 160px;
      font-size: 15px;
      border-radius: 3px;
      font-size: 18px;
      & + .el-button {
        margin-left: 50px;
      }
    }
  }
}</style>
