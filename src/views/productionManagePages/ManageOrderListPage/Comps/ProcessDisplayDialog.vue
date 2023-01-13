<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="1200"
    title="生产流程"
    :showPrimary="false"
    top="12vh"
    @open="onOpen"
    @cancel="localVisible = false"
    closeBtnText="关闭"
    >
    <div class="process-content">
      <LineFlowchartComp v-if="localOrderFlowchart" :FlowchartData="localOrderFlowchart" />
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import LineFlowchartComp from './LineFlowchartComp/LineFlowchartComp.vue';
import { OrderFlowchart } from '../js/OrderFlowchart/OrderFlowchart';
import { IManageOrderListItem } from '../js/type';

const props = defineProps<{
  visible: boolean
  row: null | IManageOrderListItem
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const localOrderFlowchart = ref<OrderFlowchart | null>(null);

const onOpen = () => {
  localOrderFlowchart.value = new OrderFlowchart();
};

</script>

<style lang='scss'>
</style>
