<template>
  <DialogContainerComp :visible='visible' :width='900' title='设置助手绑定' top='12vh'  @cancel='visible = false' :show-footer="false"
    @open='onOpen'>
    <div class='dialog-content'>
       <BindForm :curInstance="curInstance" @submited="handleSubmited" isEdit v-if="visible" />
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { ElMessage } from 'element-plus';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { TerminalEquipmentInstance } from '@/views/ProductionClient/assets/js/Instance';
import BindForm from './BindForm.vue';

const props = defineProps<{
  curInstance: Required<TerminalEquipmentInstance>
}>();

const visible = defineModel<boolean>('visible');

const onOpen = () => {
  props.curInstance.getNeedBindAssistantTypeList(true);
};

const handleSubmited = (e) => {
  props.curInstance.handleAssistantBind(e, true);
  visible.value = false;
  ElMessage.success('助手绑定设置成功');
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -60px;
  max-height: 600px;
  overflow: auto;
  overflow: overlay;
  @include scroll;

  :deep(.assistant-bind-form-wrap) {
    margin-top: 10px;
    box-shadow: none;
  }
}
</style>
