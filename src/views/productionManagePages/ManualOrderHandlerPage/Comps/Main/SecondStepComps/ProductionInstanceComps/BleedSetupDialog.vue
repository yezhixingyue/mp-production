<template>
  <DialogContainerComp :visible='localVisible' :width='600' :title="`设置出血:${fileItem?._PlateTemplate?.Name}`" top='17vh' @open='onOpen' primary-text="确定"
    @cancel='localVisible = false' @submit='submit'>
    <div class='bleed-content'>
      <div class="item">
        <span>上：</span>
        <el-input v-model.trim="ruleForm.BleedTop" maxlength="4"></el-input>
        <em>mm</em>
      </div>
      <div class="item">
        <span>左：</span>
        <el-input v-model.trim="ruleForm.BleedLeft" maxlength="4"></el-input>
        <em>mm</em>
      </div>
      <div class="item">
        <span>右：</span>
        <el-input v-model.trim="ruleForm.BleedRight" maxlength="4"></el-input>
        <em>mm</em>
      </div>
      <div class="item">
        <span>下：</span>
        <el-input v-model.trim="ruleForm.BleedBottom" maxlength="4"></el-input>
        <em>mm</em>
      </div>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IConvertOrderFile } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { MpMessage } from '@/assets/js/utils/MpMessage';

const props = defineProps<{
  visible: boolean
  fileItem: null | IConvertOrderFile
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

const ruleForm = ref<Required<Pick<IConvertOrderFile, 'BleedBottom' | 'BleedLeft' | 'BleedRight' | 'BleedTop'>>>({
  BleedTop: '',
  BleedRight: '',
  BleedBottom: '',
  BleedLeft: '',
});

const onOpen = () => {
  ruleForm.value = {
    BleedTop: '',
    BleedRight: '',
    BleedBottom: '',
    BleedLeft: '',
  };
  if (props.fileItem) restoreInitDataByOrigin(ruleForm.value, props.fileItem);
};

const submit = () => {
  // 校验
  const values = Object.values(ruleForm.value);
  // 1. 不能有空项
  if (values.findIndex(it => it === '') > -1) {
    MpMessage.error('设置失败', '有出血项未设置值');
    return;
  }
  // 2. 必须都是数字格式
  if (values.findIndex(it => !/^\d+(.\d)?$/.test(`${it}`)) > -1) {
    MpMessage.error('设置失败', '有值输入不正确，必须为大于等于0的数字类型，最多1位小数');
    return;
  }

  // 提交
  emit('submit', ruleForm.value);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.bleed-content {
  width: 400px;
  margin: 0 auto;
  padding-bottom: 30px;

  display: grid;
  grid-template-rows: 40px 40px 40px;
  grid-template-columns: 133px 133px 133px;
  grid-template-areas:
    " .    top    .   "
    "left   .   right "
    " .   bottom  .   ";

  .item {
    display: flex;
    align-items: center;
    justify-content: center;

    white-space: nowrap;
    color: #888;

    > span {
      font-size: 13px;
    }

    > em {
      font-size: 12px;
      margin-left: 5px;
    }

    &:nth-of-type(1) {
      grid-area: top;
    }

    &:nth-of-type(2) {
      grid-area: left;
    }

    &:nth-of-type(3) {
      grid-area: right;
    }

    &:nth-of-type(4) {
      grid-area: bottom;
    }
  }
}</style>
