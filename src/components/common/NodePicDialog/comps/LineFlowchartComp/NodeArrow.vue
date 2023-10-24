<template>
  <div class="mp-line-flow-chart-line-comp-wrap line" :style="lineStyle"></div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { PanelPadding } from '../../js/OrderFlowchart';
import { IOrderFlowchartDiaplayNode } from '../../js/types';

const props = defineProps<{
  arrow: IOrderFlowchartDiaplayNode['_ArrowList'][number],
}>();

const lineStyle = computed(() => `
  width:${(props.arrow?.width || 0) - 3}px;
  left:${(props.arrow?.begin.left || 0) + PanelPadding.left + 0}px;
  top:${(props.arrow?.begin.top || 0) + PanelPadding.top}px;
  transform: rotateZ(${props.arrow.rotate || 0}deg);
`);

</script>

<style scoped lang='scss'>
.mp-line-flow-chart-line-comp-wrap {
  position: absolute;
  height: 1px;
  background-color: #7A869A;
  transform-origin: 0%;
  &::before {
    content: '';
    position: absolute;
    left: -1px;
    top: -1px;
    width: 4px;
    height: 4px;
    background-color: #F2F2F2;
    z-index: 8;
  }
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
