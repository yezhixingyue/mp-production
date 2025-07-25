<template>
  <DialogContainerComp
    :title="`修改值`"
    :visible='localVisible'
    :width="700"
    @open="onOpen"
    @submit="submit"
    @cancel="localVisible = false"
    primary-text="确定"
    >
    <div class="assist-numberical-change-content">
      <span class="t">{{ item?.Name }}：</span>
      <el-input v-model.trim="num" maxlength="9"></el-input>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IConvertAssistInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';

const props = defineProps<{
  visible: boolean
  item: IConvertAssistInfo | null
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const num = ref('');

const onOpen = () => {
  num.value = props.item ? `${props.item?.Value}` : '';
};

const submit = () => {
  if (num.value === '') {
    MpMessage.error({ title: '操作失败', msg: '请输入值' });
    return;
  }
  if (!/^\d+(\.\d{1,2})?$/.test(num.value)) {
    MpMessage.error({ title: '操作失败', msg: '值设置不正确，必须为数字类型，不能小于0，最多两位小数' });
    return;
  }

  emit('submit', { ID: props.item?.ID || '', Value: +num.value });
  localVisible.value = false;
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.assist-numberical-change-content {
  height: 50px;
  overflow: auto;
  overflow: overlay;
  padding-left: 25px;
  text-align: left;
  @include scroll;
  margin-top: -10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-bottom: 10px;
  .el-input {
    width: 220px;
  }
}
</style>
