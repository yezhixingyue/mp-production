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
      content
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IManageOrderInfo } from '../../ManualOrderHandlerPage/js/types';

const props = defineProps<{
  visible: boolean
  row: null | IManageOrderInfo
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

const onOpen = () => {
  console.log('onOpen', props.row);
};

</script>

<style lang='scss'>
</style>
