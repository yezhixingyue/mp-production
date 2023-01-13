<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="600"
    title="时间线"
    :showPrimary="false"
    top="12vh"
    @open="onOpen"
    @cancel="localVisible = false"
    closeBtnText="关闭"
    >
    <div class="time-line-content">
      content
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
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

const onOpen = () => {
  console.log('onOpen', props.row);
};

</script>

<style lang='scss'>
</style>
