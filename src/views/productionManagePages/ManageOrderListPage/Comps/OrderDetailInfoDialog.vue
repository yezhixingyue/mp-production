<template>
 <DialogContainerComp
   :visible='localVisible'
   :width='600'
   title='查看加工信息'
   top='12vh'
   @open='onOpen'
   @cancel='localVisible = false'
   @submit='submit'
   :showPrimary="false"
   closeBtnText="关闭"
   >
   <div class='dialog-content'>
    {{ Describe }}
   </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';

const props = defineProps<{
  visible: boolean
  Describe: string
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
  console.log('onOpen');
};

const submit = () => {
  console.log('submit  MpMessage.dialogSuccess');
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
 margin-top: -15px;
 min-height: 160px;
 max-height: 360px;
 overflow: auto;
 overflow: overlay;

 @include scroll;
}
</style>
