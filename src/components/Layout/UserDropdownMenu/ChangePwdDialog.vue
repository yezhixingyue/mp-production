<template>
  <DialogContainerComp
    :width="500"
    top="18vh"
    title="修改密码"
    v-model:visible="localVisible"
    :primaryClick="submitForm"
    :closeClick="closeClick"
    :closed="onClosed"
    class="mp-erp-common-comps-change-password-comp-dialog-comp-wrap"
  >
    <!-- 内容区 -->
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      hide-required-asterisk
      status-icon
      :rules="rules"
      label-width="155px"
      class="demo-ruleForm">
      <el-form-item
        size="small"
        label="旧密码："
        prop="OldPassword">
        <el-input
         maxlength="16"
         type="password"
         @click="onFocusClick"
         @blur="onBlur"
         v-model.trim="ruleForm.OldPassword"
         name="password"
         autocomplete="new-psd" />
      </el-form-item>
      <el-form-item
        size="small"
        label="新密码："
        prop="Password1">
        <el-input
         maxlength="16"
         type="password"
         @click="onFocusClick"
         @blur="onBlur"
         v-model.trim="ruleForm.Password1"
         name="newpassword1"
         autocomplete="new-psd" />
      </el-form-item>
      <el-form-item
        size="small"
        label="重复新密码："
        prop="Password2">
        <el-input
         maxlength="16"
         type="password"
         @click="onFocusClick"
         @blur="onBlur"
         v-model.trim="ruleForm.Password2"
         name="newpassword2"
         autocomplete="new-psd" />
      </el-form-item>
    </el-form>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { FormInstance, FormRules } from 'element-plus';
import {
  reactive, computed, ref,
} from 'vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import api from '@/api';

const ruleFormRef = ref<FormInstance>();

const props = defineProps<{
  visible: boolean,
}>();
const emit = defineEmits(['update:visible']);

const ruleForm = reactive({
  OldPassword: '',
  Password1: '',
  Password2: '',
});
const readonly = ref(false);
const localVisible = computed({
  get() {
    return props.visible;
  },
  set(bool) {
    emit('update:visible', bool);
  },
});
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    if (ruleForm.Password2 !== '') {
      ruleFormRef.value?.validateField('Password2');
    }
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== ruleForm.Password1) {
    callback(new Error('两次输入密码不一致!'));
  } else if (value === ruleForm.OldPassword) {
    callback(new Error('新密码和旧密码输入重复!'));
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  OldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    {
      min: 6, max: 16, message: '长度应在6-16位之间', trigger: 'blur',
    },
  ],
  Password1: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      min: 6, max: 16, message: '长度在应6-16位之间', trigger: 'blur',
    },
    { validator: validatePass, trigger: 'blur' },
  ],
  Password2: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      min: 6, max: 16, message: '长度应在6-16位之间', trigger: 'blur',
    },
    { validator: validatePass2, trigger: 'blur' },
  ],
});
const submitForm = async () => {
  const bool = await ruleFormRef.value?.validate().catch(() => false);
  if (!bool) return;
  const { OldPassword, Password1 } = ruleForm;
  const temp = {
    OldPassword,
    Password: Password1,
  };
  const resp = await api.getStaffChangePassword(temp).catch(() => null);
  if (resp && resp.data.Status === 1000) {
    const cb = () => {
      localVisible.value = false;
    };
    MpMessage.dialogSuccess({
      title: '修改成功', onOk: cb, onCancel: cb,
    });
  }
};
const closeClick = () => {
  localVisible.value = false;
};
const onClosed = () => {
  ruleFormRef.value?.resetFields();
};
const onFocusClick = () => {
  readonly.value = false;
};
const onBlur = () => {
  readonly.value = true;
};
</script>
<style lang='scss'>
.mp-erp-common-comps-change-password-comp-dialog-comp-wrap {
  .el-dialog__body {
    padding-top: 40px;
    padding-bottom: 50px;
    .demo-ruleForm {
      padding-right: 70px;
      .el-form-item {
        input {
          border-radius: 3px;
          height: 32px;
        }
        &:first-of-type {
          margin-bottom: 30px;
        }
      }
      .el-form-item__label {
        line-height: 30px;
      }
    }
  }
}
</style>
