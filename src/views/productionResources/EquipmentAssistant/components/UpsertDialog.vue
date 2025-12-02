<template>
  <DialogContainerComp :visible='visible' :width='600' :title='!target ? "新增助手" : "编辑助手"' top='12vh'  @cancel='visible = false'
    @open='onOpen' @submit='submit'>
    <div class='dialog-content' v-if="ruleForm">
      <el-form ref="formRef" :model="ruleForm" label-width="170px">
        <el-form-item label="姓名：" prop="Name" :rules="[{ required: true, message: '请输入姓名' }]">
          <el-input v-model.trim="ruleForm.Name" maxlength="15" style="width: 280px" />
        </el-form-item>

        <el-form-item label="身份证号：" prop="IDCard"
          :rules="[
            { required: true, message: '请输入身份证号' },
            { validator: idCardvalidator, message: '身份证号码不正确' },
          ]">
          <el-input v-model.trim="ruleForm.IDCard" maxlength="18" style="width: 280px" />
        </el-form-item>

        <el-form-item label="状态：" prop="IsDisable" :rules="[{ required: true, message: '请勾选状态' }]">
          <el-radio-group v-model="ruleForm.IsDisable">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="担任助手类型：" prop="TypeList">
          <el-checkbox-group v-model="ruleForm.TypeList">
            <el-checkbox v-for="it in localAssistantTypeList" :key="it.ID" :label="it.ID" :value="it.ID" :title="it.Name">{{ it.Name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { nextTick, ref } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { validateIdCard } from '@/views/companyManage/StaffManage/js/IdCardvalidator';
import { useUserHook } from '@/store/modules/user';
import { IAssistantInfo } from '../types/types';
import { ItemUpsertForm } from '../model/ItemUpsertForm';
import { AssistantListManageModel } from '../model/AssistantListManageModel';
import { localAssistantTypeList } from '../store';

const props = defineProps<{
  target: null | IAssistantInfo
  localAssistantManageModel: AssistantListManageModel
}>();

const visible = defineModel<boolean>('visible');

const { user } = useUserHook();

const formRef = ref<FormInstance>();

const ruleForm = ref<null | ItemUpsertForm>(null);

const onOpen = async () => {
  ruleForm.value = new ItemUpsertForm(props.target);

  if (!formRef.value) return;

  formRef.value.resetFields();
  await nextTick();
  formRef.value.clearValidate();
};

const idCardvalidator = (rule, value, callback) => { // 身份证校验函数
  if (validateIdCard(value)) {
    callback();
    return;
  }
  callback(new Error());
};

const submit = () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (valid && ruleForm.value && user.value) {
      const bool = await props.localAssistantManageModel.upsert(ruleForm.value, user.value.StaffName);
      if (bool) {
        ElMessage.success(!props.target ? '添加成功' : '编辑成功');
        visible.value = false;
      }
    }
  });
};
</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -15px;
  min-height: 160px;
  max-height: 420px;
  overflow: auto;
  overflow: overlay;
  @include scroll;

  :deep(.el-checkbox) {
    margin-right: 10px;
    .el-checkbox__label {
      width: 8em;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
