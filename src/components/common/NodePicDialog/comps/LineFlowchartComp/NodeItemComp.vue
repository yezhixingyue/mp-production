<template>
  <div>
    <div class="mp-line-flow-chart-item-comp-wrap item" :style="boxStyle" :data-taskworkingid="item.TaskWorkingID">
      <div class="square" :style="squareStyle" :title="item.WorkingName">{{ item.WorkingName }}</div>
      <p v-if="item.Equipment?.Name" :title="EquipmentMixName">{{ EquipmentMixName }}</p>
      <p v-if="item.FinishTime">{{ format2MiddleLangTypeDateFunc2(item.FinishTime).slice(2) }}</p>
      <p v-if="item.Operator" :title="OperatorName">{{ OperatorName }}</p>
    </div>
    <NodeArrow v-for="(arrow, index) in props.item._ArrowList" :key="arrow.rotate" :arrow="arrow" :index="index" :total="props.item._ArrowList.length" />
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import NodeArrow from './NodeArrow.vue';
import { FlowchartNodeStatusEnumList } from '../../js/EnumList';
import { PanelPadding, NodeWidth, NodeHeight } from '../../js/OrderFlowchart';
import { IOrderFlowchartDiaplayNode } from '../../js/types';
import { format2MiddleLangTypeDateFunc2 } from '../../_difference';

const props = defineProps<{
  item: IOrderFlowchartDiaplayNode,
}>();
const boxStyle = computed(() => `
  left:${props.item._Coordinate.left + PanelPadding.left}px;
  top:${props.item._Coordinate.top + PanelPadding.top}px;
  width:${NodeWidth}px;
`);

const squareStyle = computed(() => {
  const t = FlowchartNodeStatusEnumList.find(it => it.ID === props.item.Status);
  if (!t) return `height:${NodeHeight}px`;

  return `height:${NodeHeight}px;background-color: ${t.Color};color: #fff;`;
});
// const squareClass = computed(() => ({
//   completed: props.item.Status === FlowchartNodeStatusEnum.completed,
//   inProduction: props.item.Status === FlowchartNodeStatusEnum.inProduction,
//   atQuestion: props.item.Status === FlowchartNodeStatusEnum.atQuestion,
// }));

const EquipmentMixName = (props.item.Equipment?.GroupName ? `${props.item.Equipment?.GroupName}-` : '') + (props.item.Equipment?.Name || '');

const OperatorName = props.item.Operator || '';

</script>

<style scoped lang='scss'>
.mp-line-flow-chart-item-comp-wrap {
  position: absolute;
  font-size: 12px;
  text-align: center;
  .square {
    border: 1px solid #707070;
    border-radius: 2px;
    box-sizing: border-box;
    line-height: 28px;
    font-size: 14px;
    color: #444;
    margin-bottom: 3px;
    white-space: nowrap;
    padding-left: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    // &.completed {
    //   background-color: #4B7902;
    //   color: #fff;
    // }
    // &.inProduction {
    //   background-color: #00BFBF;
    //   color: #fff;
    // }
    // &.atQuestion {
    //   background-color: #A30014;
    //   color: #fff;
    // }
  }
  p {
    // line-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

</style>
