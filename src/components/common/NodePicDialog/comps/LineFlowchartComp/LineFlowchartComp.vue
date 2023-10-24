<template>
  <div class="mp-line-flow-chart-comp-wrap" :style="wrapStyle">
    <p class="title">{{ FlowchartData.LineName }}</p>
    <NodeItemComp v-for="it in FlowchartData.DisplayList" :key="it.TaskWorkingID" :item="it" />
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import NodeItemComp from './NodeItemComp.vue';
import { OrderFlowchart, PanelPadding } from '../../js/OrderFlowchart';

const props = defineProps<{
  FlowchartData: Required<OrderFlowchart>,
}>();

const wrapStyle = computed(() => `
  width:${props.FlowchartData.TotalWidth}px;
  height:${props.FlowchartData.TotalHeight}px;
  padding-left:${PanelPadding.left}px;
  padding-top:${PanelPadding.top}px;
  padding-right:${PanelPadding.right}px;
  padding-bottom:${PanelPadding.bottom}px;
`);
</script>

<style scoped lang='scss'>
.mp-line-flow-chart-comp-wrap {
  position: relative;
  margin: 0 auto;
  background: #F2F2F2;
  &:after{
    content: "";
    height: 0;
    clear: both;
    overflow: hidden;
    display: block;
    visibility: hidden;
  }

  .title {
    font-size: 14px;
    color: #444;
    font-weight: 700;
    position: relative;
    top: -30px;
  }
}
</style>
