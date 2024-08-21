<template>
 <DialogContainerComp
   :visible='revocationData.visible'
   :width='460'
   title='撤销原因'
   top='16vh'
   @closed="resetForm"
   @cancel='() => revocationData.close()'
   @submit='submit'
   @opened="onopened"
   primaryText="确定撤销"
   >
   <div class='dialog-content'>
    <p class="mb-5">请输入撤销原因：</p>
    <el-form ref="formRef" label-width="0" :model="revocationData">
      <el-form-item prop="Remark"
        :rules="[
          { required: true, message: '请输入撤销原因' },
          { min: 2, message: '至少输入2个字符' },
        ]"
      >
        <el-input type="textarea" ref="oInp" :rows="6" maxlength="50" v-model.trim="localHandler.Remark" show-word-limit></el-input>
      </el-form-item>
    </el-form>
   </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { computed, ref } from 'vue';
import { FormInstance, InputInstance } from 'element-plus';
import { RevocationData } from '../js/RevocationData';

const props = defineProps<{
  revocationData: RevocationData
}>();

const emit = defineEmits(['submit']);

const localHandler = computed(() => props.revocationData);

const formRef = ref<FormInstance>();
const oInp = ref<InputInstance>();

const onopened = () => {
  if (oInp.value) oInp.value.focus();
};

const resetForm = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
};

const submit = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid) => {
    if (valid && props.revocationData.currentRow) {
      const temp = {
        Remark: props.revocationData.Remark,
        Code: props.revocationData.currentRow.Code,
        OrderID: props.revocationData.currentRow.OrderID,
      };
      emit('submit', temp);
    }
  });
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
 margin-top: -20px;
 height: 160px;
 padding: 0 10px;
}
</style>
