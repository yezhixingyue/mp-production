<template>
  <div class="mp-line-flow-chart-item-comp-wrap item" :style="boxStyle">
    <div class="square" :style="squareStyle" :class="squareClass" :title="item.Name">{{ item.Name }}</div>
    <p v-if="item.EquipmentName" :title="EquipmentMixName">{{ EquipmentMixName }}</p>
    <p v-if="item.Status===FlowchartNodeStatusEnum.completed && item.CompletionTime">{{ format2MiddleLangTypeDateFunc2(item.CompletionTime).slice(2) }}</p>
    <p v-if="item.Status===FlowchartNodeStatusEnum.completed && item.Operator" :title="OperatorName">{{ OperatorName }}</p>
  </div>
  <div v-if="props.item._Arrow" class="mp-line-flow-chart-line-comp-wrap line" :style="lineStyle"></div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { FlowchartNodeStatusEnum } from '../../js/OrderFlowchart/enum';
import { NodeWidth, NodeHeight, PanelPadding } from '../../js/OrderFlowchart/OrderFlowchart';
import { IOrderFlowchartDiaplayNode } from '../../js/OrderFlowchart/types';

const props = defineProps<{
  item: IOrderFlowchartDiaplayNode,
}>();
const boxStyle = computed(() => `
  left:${props.item._Coordinate.left + PanelPadding.left}px;
  top:${props.item._Coordinate.top + PanelPadding.top}px;
  width:${NodeWidth}px;
`);

const squareStyle = computed(() => `height:${NodeHeight}px`);
const squareClass = computed(() => ({
  completed: props.item.Status === FlowchartNodeStatusEnum.completed,
  inProduction: props.item.Status === FlowchartNodeStatusEnum.inProduction,
  atQuestion: props.item.Status === FlowchartNodeStatusEnum.atQuestion,
}));

const EquipmentMixName = (props.item.EquipmentGroupName ? `${props.item.EquipmentGroupName}-` : '') + props.item.EquipmentName;

const OperatorName = props.item.Operator || '';

/** 箭头相关 */
const lineStyle = computed(() => `
  width:${(props.item._Arrow?.width || 0) - 4}px;
  left:${(props.item._Arrow?.begin.left || 0) + PanelPadding.left + 2}px;
  top:${(props.item._Arrow?.begin.top || 0) + PanelPadding.top}px;
  transform: rotateZ(${props.item._Arrow?.rotate || 0}deg);
`);

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
    &.completed {
      background-color: #4B7902;
      color: #fff;
    }
    &.inProduction {
      background-color: #00BFBF;
      color: #fff;
    }
    &.atQuestion {
      background-color: #A30014;
      color: #fff;
    }
  }
  p {
    // line-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.mp-line-flow-chart-line-comp-wrap {
  position: absolute;
  height: 1px;
  background-color: #7A869A;
  transform-origin: 0%;
  &::after {
    content: '';
    border: 4px solid #7A869A;
    position: absolute;
    right: -5px;
    top: -3.5px;
    border-right-color: rgba($color: #000000, $alpha: 0);
    border-top-color: rgba($color: #000000, $alpha: 0);
    border-bottom-color: rgba($color: #000000, $alpha: 0);
    border-left-width: 6px;
  }
}
</style>
