<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="isSplitWorking ? 960 : 560"
    :title="`设置完工：${curInstance.curTaskData?.Working.WorkingName || ''}`"
    @cancel="localVisible = false"
    @submit="submit"
    @open="onOpen"
    primaryText="完工"
    class="mp-client-set-task-complete-dialog-wrap"
    :top="isSplitWorking ? '12vh' : '20vh'"
    >
    <ul class="dialog-content" v-if="curInstance.curTaskData && localInfo" :class="{split: isSplitWorking}">
      <!-- ID -->
      <li v-if="curInstance.curTaskData.Working.ReportMode === ReportModeEnum.board && curInstance.curTaskData.Working.PlateInfo"
        :class="{'mr-60': isSplitWorking}">
        <span class="label">大版ID：</span>
        <h4>{{ curInstance.curTaskData.Working.PlateInfo.Code }}</h4>
      </li>
      <li v-if="curInstance.curTaskData.Working.ReportMode !== ReportModeEnum.board && curInstance.curTaskData.Working.OrderInfo"
        :class="{'mr-60': isSplitWorking}">
        <span class="label">订单ID：</span>
        <span class="mr-5">{{ curInstance.curTaskData.Working.OrderInfo.ServerName }}</span>
        <h4>{{ curInstance.curTaskData.Working.OrderInfo.OrderID }}</h4>
      </li>
      <!-- 标题 -->
      <li class="title">
        <span v-if="localInfo.FirstTitle">
          {{ localInfo.FirstTitle }}
        </span>
        <span v-if="curInstance.curTaskData.Working.ReportMode === ReportModeEnum.block && curInstance.curTaskData.Working.ChunkInfo?.Name">
          {{ curInstance.curTaskData.Working.ChunkInfo.Name }}
        </span>
        <span v-if="localInfo.SecondTitle">{{ localInfo.SecondTitle }}</span>
      </li>
      <!-- 工序列表 -->
      <li v-if="!isSplitWorking && localInfo.WorkingList.length > 0" class="work-list">
        <span class="label">工序：</span>
        <div>
          <h4 v-for="(it, i) in localInfo.WorkingList" :key="it.ID">
            <span>{{ it.Name }}</span>
            <i v-if="i < localInfo.WorkingList.length - 1" class="ml-7 mr-5">-></i>
          </h4>
        </div>
      </li>
      <!-- 报工数量 仅允许部分报工时显示 -->
      <li class="count" :class="{'pt-8': curInstance.curTaskData.Working.AllowPartReport}">
        <span>报工数量：</span>
        <el-input v-model.number="count" maxlength="8" v-if="curInstance.curTaskData.Working.AllowPartReport" />
        <h4 v-else>{{ curInstance.curTaskData.UnFinishNumber }}</h4>
        <i>{{ localInfo.Unit }}/共</i>
        <h4 v-if="curInstance.curTaskData.Working.AllowPartReport">{{ curInstance.curTaskData.UnFinishNumber }}</h4>
        <span v-else>{{ curInstance.curTaskData.UnFinishNumber }}</span>
        <i>{{ localInfo.Unit }}</i>
      </li>
      <!-- 下一道工序 -->
      <li class="next" v-if="_NextWorkContent || isSplitWorking">
        <hr>
        <!-- 非分切工序 -->
        <div v-if="_NextWorkContent">
          <span>
            下一道工序：<i>{{ _NextWorkContent.NextWorkName }}</i>
          </span>
          <h2 v-if="_NextWorkContent.EquipmentName">{{ _NextWorkContent.EquipmentName }}</h2>
        </div>
        <!-- 分切工序 -->
        <dl v-if="isSplitWorking && props.curInstance.curTaskData && props.curInstance.curTaskData.NextWorkingList.length > 0">
          <!-- <dt>色彩示例</dt> -->
          <dd v-for="it in props.curInstance.curTaskData.NextWorkingList" :key="it.ID">
            <div class="block" :style="`background-color:${it.Color}`"></div>
            <h5>下一道工序：</h5>
            <h4>{{ it.Name }}</h4>
            <h4>{{ [it.Equipment.GroupName, it.Equipment.Name].filter(it => it).join('-') }}</h4>
          </dd>
        </dl>
      </li>
    </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { ReportModeEnum, WorkingTypeEnum } from '@/views/productionSetting/process/enums';
import { TerminalEquipmentInstance } from '@/views/ProductionClient/assets/js/Instance';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getTaskDisplayInfo } from '.';

const props = defineProps<{
  visible: boolean
  curInstance: Required<TerminalEquipmentInstance>,
}>();

const emit = defineEmits(['update:visible', 'complete']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const localInfo = computed(() => (props.curInstance.curTaskData ? getTaskDisplayInfo(props.curInstance.curTaskData, false) : null));

/** 是否为拆分工序 */
const isSplitWorking = computed(() => props.curInstance.curTaskData?.Working.Type === WorkingTypeEnum.split);

/** 下一道工序文字信息 */
const _NextWorkContent = computed(() => {
  if (isSplitWorking.value) {
    return null;
  }

  const temp = {
    NextWorkName: '',
    EquipmentName: '',
  };

  if (props.curInstance.curTaskData?.NextWorkingList?.length === 1) {
    const next = props.curInstance.curTaskData.NextWorkingList[0];
    if (!next.Name) return null;

    temp.NextWorkName = next.Name;

    if (next.Equipment) {
      const _class = [next.Equipment.GroupName, next.Equipment.Name].filter(it => it).join('-');
      if (_class) {
        temp.EquipmentName = _class;
      }
    }
  }

  return temp;
});

const count = ref<number | ''>('');

const onOpen = () => {
  count.value = '';
};

const submit = () => {
  if (props.curInstance.curTaskData?.Working.AllowPartReport) { // 允许部分报工
    if (!count.value && count.value !== 0) {
      MpMessage.error({ title: '操作失败', msg: '请输入本次报工数量' });
      return;
    }
    if (count.value === 0 || !/^\d+$/.test(`${count.value}`)) {
      MpMessage.error({ title: '操作失败', msg: '报工数量输入不正确，请输入正整数类型' });
      return;
    }
    if (count.value > props.curInstance.curTaskData.UnFinishNumber) {
      MpMessage.error({ title: '操作失败', msg: `报工数量不能大于剩余全部数量${props.curInstance.curTaskData.UnFinishNumber}` });
      return;
    }
  }

  emit('complete', count.value);
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
    margin-bottom: 15px;
    line-height: 24px;
    &:first-of-type {
      h4 {
        font-size: 20px;
      }
    }
    &.title {
      display: block;
      line-height: 20px;
      span:not(:last-of-type) {
        margin-right: 10px;
      }
    }

    &.work-list {
      > span {
        flex: none;
      }
      > div {
        display: flex;
        flex-wrap: wrap;

        h4 {
          font-size: 17px;
          &.active {
            color: #26bcf9;
          }
        }
      }
    }
    &.count {
      align-items: center;
      width: 100%;
      // padding-top: 8px;
      .el-input {
        width: 170px;
        height: 50px;
        font-size: 18px;
        margin-right: 8px;
        :deep(input) {
          text-align: center;
        }
      }
      h4 {
        font-size: 22px;
        margin: 0 4px;
      }
    }
    &.next {
      width: 100%;
      flex-direction: column;
      hr {
        margin: 0 -30px;
        border: none;
        border-bottom: 1px solid #d4d4d4;
        margin-top: 5px;
      }
      > div {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        > span {
          margin-right: 50px;
          margin-top: 20px;
          > i {
            font-size: 18px;
            color: #FF0000;
          }
        }
        > h2 {
          margin-top: 20px;
          line-height: 30px;
          font-size: 30px;
          color: #FF0000;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        }
      }

      > dl {
        display: flex;
        flex-wrap: wrap;
        margin-top: 12px;
        dd {
          min-width: 50%;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 10px;
          box-sizing: border-box;
          padding-right: 10px;
          .block {
            width: 60px;
            height: 30px;
            flex: none;
            box-sizing: border-box;
            border-radius: 2px;
            border: 1px solid rgb(121, 121, 121);
          }
          h5 {
            font-size: 16px;
            margin-left: 10px;
            margin-right: 4px;
            flex: none;
            font-weight: 400;
          }
          h4 {
            color: #FF0000;
            font-size: 19px;
            margin-right: 15px;
            &:last-of-type {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
  &.split {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>

<style lang="scss">
.mp-client-set-task-complete-dialog-wrap {
  .el-dialog__footer {
    padding-top: 5px;
    padding-bottom: 22px;
    .el-button {
      height: 47px;
      width: 162px;
      font-size: 15px;
      border-radius: 3px;
      font-size: 18px;
      & + .el-button {
        margin-left: 70px;
      }
    }
  }
}</style>
