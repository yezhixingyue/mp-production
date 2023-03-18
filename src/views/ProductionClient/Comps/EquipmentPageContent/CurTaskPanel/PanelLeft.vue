<template>
  <div class="left-box">
    <ul>
      <!-- 任务ID、 大版ID | 任务信息 -->
      <li class="code">
        <div>
          <span class="label">任务ID：</span>
          <span>{{ TaskData.Code }}</span>
        </div>
        <div v-if="TaskData.Working.ReportMode === ReportModeEnum.board && TaskData.Working.PlateInfo">
          <span class="label">大版ID：</span>
          <span>{{ TaskData.Working.PlateInfo.Code }}</span>
        </div>
        <div v-if="TaskData.Working.ReportMode !== ReportModeEnum.board && TaskData.Working.OrderInfo">
          <span class="label">订单ID：</span>
          <span class="mr-5">{{ TaskData.Working.OrderInfo.ServerName }}</span>
          <span>{{ TaskData.Working.OrderInfo.OrderID }}</span>
        </div>
      </li>
      <!-- 标题信息  大版显示物料和模板信息   订单和块显示产品、块名称、销售尺寸信息 -->
      <li class="title">
        <div>
          <span class="f" v-if="localInfo.FirstTitle">
            {{ localInfo.FirstTitle }}
          </span>
          <h4 v-if="TaskData.Working.ReportMode === ReportModeEnum.block && TaskData.Working.ChunkInfo?.Name">
            {{ TaskData.Working.ChunkInfo.Name }}
          </h4>
        </div>
        <div v-if="localInfo.SecondTitle">{{ localInfo.SecondTitle }}</div>
      </li>
      <!-- 订单内容 - 非大版时显示 -->
      <li class="content" v-if="TaskData.Working.ReportMode !== ReportModeEnum.board && TaskData.Working.OrderInfo?.Content">
        <h5>内容：</h5>
        <p>{{ TaskData.Working.OrderInfo.Content }}</p>
      </li>
    </ul>

    <ul>
      <!-- 报工数量 -->
      <li class="number">
        <h1>剩余{{ TaskData.UnFinishNumber }}{{ localInfo.Unit }} /</h1>
        <span>共{{ TaskData.TotalNumber }}{{ localInfo.Unit }}</span>
        <span class="gray" v-if="TaskData.Working.AllowPartReport">（已报{{ TaskData.TotalNumber - TaskData.UnFinishNumber }}{{ localInfo.Unit }}）</span>
      </li>
      <!-- 辅助文字信息 -->
      <li class="assist" v-if="_AssistTextList.length > 0">
        <span v-for="(s, i) in _AssistTextList" :key="i">{{ s }}{{ i < _AssistTextList.length - 1 ? '；' : '' }}</span>
      </li>
    </ul>

    <ul class="footer">
      <!-- 下一道工序 -->
      <li class="next" v-if="_NextWorkContent">
        <span>下一道工序：</span>
        <h4>{{ _NextWorkContent }}</h4>
      </li>
      <!-- 按钮 -->
      <li class="btns">
        <mp-button type="primary" class="primary" @click="onCompleteClick">加工完成</mp-button>
        <mp-button class="blue" @click="onErrorClick">报错</mp-button>
      </li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { getNextWorkContentOnlySingle } from '@/views/ProductionClient/assets/js/utils';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { computed } from 'vue';
import { getTaskDisplayInfo } from '.';

const props = defineProps<{
  TaskData: ITaskDetail
}>();

const emit = defineEmits(['complete', 'error']);

const localInfo = computed(() => getTaskDisplayInfo(props.TaskData));

/** 辅助文字信息 */
const _AssistTextList = computed(() => {
  const list = props.TaskData.Working.AssistList || [];
  return list.filter(it => it.Type === AssistInfoTypeEnum.text).map(it => it.Content).filter(Content => Content);
});

/** 下一道工序文字信息 */
const _NextWorkContent = computed(() => getNextWorkContentOnlySingle(props.TaskData.NextWorkingList));

const onCompleteClick = () => {
  emit('complete', null);
};

const onErrorClick = () => {
  emit('error');
};

</script>

<style scoped lang='scss'>
.left-box {
  width: 635px;
  margin-right: 30px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  padding-bottom: 30px;
  min-height: 445px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  line-height: 24px;

  > ul {
    > li {
      &.code {
        color: #888;
        display: flex;
        font-size: 16px;
        > div {
          display: flex;
          & + div {
            margin-left: 45px;
          }
        }
      }
      &.title {
        font-size: 20px;
        // margin-top: 10px;
        .f {
          margin-right: 40px;
        }
        h4 {
          display: inline-block;
          font-size: 18px;
        }
      }
      &.content {
        color: #888;
        margin-top: 8px;
        line-height: 18px;
        h5 {
          font-size: 15px;
        }
      }
      &.number {
        display: flex;
        font-size: 20px;
        align-items: center;
        // margin-top: 12px;
        h1 {
          font-size: 26px;
          margin-right: 10px;
        }
        .gray {
          color: #D4D4D4;
        }
      }
      &.assist {
        color: #FF0000;
        font-size: 30px;
        line-height: 30px;
        font-weight: 700;
        margin-top: 6px;
        span {
          display: block;
        }
      }
    }
  }
  .next {
    font-size: 18px;
    margin-top: 18px;
    display: flex;
  }
  .btns {
    margin-top: 15px;
    display: flex;
    align-items: flex-end;
    --el-border-radius-base: 6px;
    button {
      width: 150px;
      height: 50px;
      font-size: 24px;
      margin-left: 0;
      &.primary {
        font-size: 30px;
        width: 200px;
        height: 60px;
        color: #fff;
        font-family: Microsoft YaHei UI-Regular, Microsoft YaHei UI;
        margin-right: 60px;
      }
    }
  }
}
</style>
