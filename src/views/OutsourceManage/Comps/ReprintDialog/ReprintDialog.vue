<template>
  <DialogContainerComp :visible='visible' :width='600' title='补打外协单' top='12vh'  @cancel='visible = false' :showFooter="false" @open='onOpen'>
    <div class='dialog-content'>
      <div class="box" v-if="ruleForm">
        <span>任务ID：</span>
        <el-input :class="{error: !!ruleForm?.errMsg}" v-model.trim="ruleForm.code" class="inp" @keyup.enter="submit" maxlength="12"></el-input>
        <mp-button type="primary" style="width: 60px;"  @click="submit">
          <i class="iconfont icon-sousuo" style="font-size: 24px;margin: 0;"></i>
        </mp-button>
      </div>

      <p class="err is-pink">
        <transition name="el-fade-in-linear">
          <span v-if="ruleForm?.errMsg">{{ ruleForm.errMsg }}</span>
        </transition>
      </p>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { ref } from 'vue';
import { OutsourceOrderRePrintForm } from './ruleFom';

const visible = defineModel<boolean>('visible');

const emit = defineEmits(['reprint']);

const ruleForm = ref<null | OutsourceOrderRePrintForm>(null);
const onOpen = () => {
  ruleForm.value = new OutsourceOrderRePrintForm();
};

const submit = async () => {
  if (ruleForm.value) {
    const data = await ruleForm.value.submit();
    if (data) {
      visible.value = false;
      setTimeout(() => {
        emit('reprint', data);
      }, 10);
    }
  }
};

</script>

<style scoped lang='scss'>
.dialog-content {
  height: 120px;
  padding-left: 120px;

  .box {
    display: flex;
    align-items: center;

    .inp {
      width: 200px;
      margin-right: 10px;

      &.error {
        --el-input-border-color: #ff3769;
        --el-input-focus-border-color: #ff3769;
        --el-input-hover-border-color: #ff3769;
      }
    }
  }

  .err {
    width: 360px;
    margin-left: 55px;
    font-size: 12px;
    margin-top: 4px;
  }
}
</style>
