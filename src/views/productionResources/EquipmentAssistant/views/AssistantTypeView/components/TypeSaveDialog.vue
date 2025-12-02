<template>
  <DialogContainerComp :visible='visible' :width='600' :title='!item ? "新增助手类型" : "编辑助手类型"' top='12vh'  @cancel='visible = false'
    @open='onOpen' @submit='submit'>
    <div class='dialog-content' v-if="ruleForm">
      <el-form ref="formRef" style="width: 450px" :model="ruleForm" label-width="170px">
        <el-form-item label="助手类型名：" prop="Name"
          :rules="[{ required: true, message: '请输入助手类型名称' }]"
        >
          <el-input v-model.trim="ruleForm.Name" maxlength="30" />
        </el-form-item>

        <el-form-item label="简称：" prop="NickName">
          <el-input v-model.trim="ruleForm.NickName" maxlength="10" />
        </el-form-item>

        <el-form-item label="状态：" prop="IsDisable">
          <el-radio-group v-model="ruleForm.IsDisable">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="报工次序：" prop="Index" key="Index"
          :rules="[
            { required: true, message: '请输入报工次序' },
            { type: 'number', message: '格式不正确，请输入数字类型' },
            { validator: (rule, value, callback) => value >= 0 && value <= 255, message: '请输入0 - 255之间的整数数值' },
          ]"
        >
          <el-input v-model.number="ruleForm.Index" maxlength="3" />
        </el-form-item>

        <el-form-item label="任(兼)职数：" prop="Number" key="Number"
          :rules="[
            { required: true, message: '请输入任(兼)职数量' },
            { type: 'number', message: '格式不正确，请输入数字类型' },
            { validator: (rule, value, callback) => value >= 1 && value <= 100, message: '请输入1 - 100之间的整数数值' },
          ]"
        >
          <el-input v-model.number="ruleForm.Number" maxlength="3" />
        </el-form-item>
      </el-form>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { nextTick, ref } from 'vue';
import type { FormInstance } from 'element-plus';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IAssistantType } from '../../../types/types';
import { TypeEditRuleForm } from '../model/ruleForm';

const formRef = ref<FormInstance>();

const props = defineProps<{
  item: null | IAssistantType
}>();

const emit = defineEmits(['submit']);

const visible = defineModel<boolean>('visible');

const ruleForm = ref<TypeEditRuleForm | null>(null);

const onOpen = async () => {
  ruleForm.value = new TypeEditRuleForm(props.item);

  if (!formRef.value) return;

  formRef.value.resetFields();
  await nextTick();
  formRef.value.clearValidate();
};

const submit = () => {
  if (!formRef.value) return;

  formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', ruleForm.value);
    }
  });
};

</script>

<style scoped lang='scss'>

.dialog-content {
  margin-top: -15px;
  height: 240px;
}
</style>
