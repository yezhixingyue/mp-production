<template>
  <DialogContainerComp :visible='visible' :width='600' title='修改需求人数' top='12vh'  @cancel='visible = false'
    @open='onOpen' @submit='submit'>
    <div class='dialog-content' v-if="ruleForm">
      <el-form ref="formRef" style="width: 450px" :model="ruleForm" label-width="230px">
        <el-form-item label="设备组：">
          <span>{{ currentGroup?.Name }}</span>
        </el-form-item>

        <el-form-item label="助手类型名：">
          <span>{{ relationModel.target.Name }}</span>
        </el-form-item>

        <el-form-item label="最少人数：" prop="MinNumber"
          :rules="[
            { required: true, message: '请输入最少人数' },
            { type: 'number', message: '格式不正确，请输入数字类型' },
            { validator: getValidator('MinNumber'), message: `请输入0 - 100之间的整数数值` },
          ]"
        >
          <el-input v-model.number="ruleForm.MinNumber" maxlength="3" style="width: 160px;" />
        </el-form-item>

        <el-form-item label="最多人数：" prop="MaxNumber"
          :rules="[
            { required: true, message: '请输入最多人数' },
            { type: 'number', message: '格式不正确，请输入数字类型' },
            { validator: getValidator('MaxNumber'), message: `请输入${Math.max(ruleForm.MinNumber > 100 ? 1 : ruleForm.MinNumber, 1)} - 100之间的整数数值` },
          ]"
        >
          <el-input v-model.number="ruleForm.MaxNumber" maxlength="3" style="width: 160px;" />
        </el-form-item>
      </el-form>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { nextTick, ref } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';
import { IAssistantRelationGroup } from '../../../types/types';
import { TypeGroupRelationModel } from '../model/TypeGroupRelationModel';

const props = defineProps<{
  currentGroup: null | IAssistantRelationGroup
  relationModel: TypeGroupRelationModel
}>();

const visible = defineModel<boolean>('visible');

const formRef = ref<FormInstance>();

const ruleForm = ref<null | IAssistantRelationGroup>(null);

const onOpen = async () => {
  if (props.currentGroup) {
    ruleForm.value = { ...props.currentGroup };
  } else {
    ElMessage.error('请注意：初始数据获取失败');
  }

  if (!formRef.value) return;

  formRef.value.resetFields();
  await nextTick();
  formRef.value.clearValidate();
};

const getValidator = (key: keyof Pick<IAssistantRelationGroup, 'MinNumber' | 'MaxNumber'>) => (rule, value) => {
  if (!ruleForm.value) return true;

  if (key === 'MinNumber') {
    return value >= 0 && value <= 100;
  }

  return value >= Math.max(ruleForm.value.MinNumber > 100 ? 1 : ruleForm.value.MinNumber, 1) && value <= 100;
};

const submit = () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (valid && ruleForm.value) {
      const bool = await props.relationModel.setGroupMinMaxNumber(ruleForm.value);
      if (bool) {
        ElMessage.success('设置成功');
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
  max-height: 360px;
  overflow: auto;
  overflow: overlay;
  @include scroll;
}
</style>
