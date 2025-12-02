<template>
  <section v-if="curInstance.NeedBindAssistantList && ruleForm" class="assistant-bind-form-wrap">
    <header>
      <h2>助手绑定</h2>
    </header>

    <main>
      <div class="password" v-if="isEdit">
        <label for="" style="width: 180px;text-align: right;margin-right: 10px;font-size: 15px;">密码验证：</label>
        <el-input style="width: 360px" size="large" v-model.trim="state.Password" type="password" maxlength="16" @keyup.enter="onPasswordVerifyClick"
         autocomplete="new-password" :disabled="state.VerifySuccess" />
        <div class="btn">
          <span class="is-blue-span" v-if="!state.VerifySuccess" @click="onPasswordVerifyClick">验证</span>
          <!-- <span class="success is-success" v-else>验证通过</span> -->
          <el-icon class="is-success" v-else><Select /></el-icon>
        </div>
        <span class="error is-pink">{{ state.VerifyError }}</span>
      </div>

      <el-form
        ref="formRef"
        :model="ruleForm"
        label-width="190px"
        size="large"
        :disabled="isEdit && !state.VerifySuccess"
      >
        <el-form-item
          v-for="it in curInstance.NeedBindAssistantList" :key="curInstance.Equipment.ID + it.label"
          :prop="it.label"
          :rules="[
            { required: it.Required, message: `请选择${it.Name}` },
          ]"
        >
          <template #label>
            <span class="form-label" :title="it.Name">{{ it.Name }}</span>
          </template>
          <el-select v-model="ruleForm[it.label]" placeholder="" style="width: 360px" clearable>
            <el-option
              v-for="item in it.MemberList" :key="item.ID"
              :label="item.Name" :value="item.ID"
              :disabled="selectedIds.includes(item.ID) && ruleForm[it.label] !== item.ID" />
          </el-select>
        </el-form-item>
      </el-form>
    </main>

    <footer>
      <p class="tips-box">
        <el-icon><WarningFilled /></el-icon>
        <span>注意：非必须助手类型可以不设置人员，直接点“绑定”！</span>
      </p>

      <el-button type="primary" @click="submitForm" :disabled="isEdit && !state.VerifySuccess">绑定</el-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { computed, nextTick, ref, watch } from 'vue';
import type { FormInstance } from 'element-plus';
import { TerminalEquipmentInstance } from '@/views/ProductionClient/assets/js/Instance';
import clientApi from '@/api/client';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getAssistantParamsList, getAssistantRuleFormObj } from './utils';
import { usePasswordVerify } from './usePasswordVerify';

const props = defineProps<{
  curInstance: Required<TerminalEquipmentInstance>
  isEdit?: boolean
}>();

const emit = defineEmits(['submited']);

const formRef = ref<FormInstance>();

const ruleForm = ref<{ [key: string]: string } | null>(null);

const initForm = async () => {
  ruleForm.value = null;

  if (props.curInstance.NeedBindAssistantList?.length) {
    await nextTick();

    ruleForm.value = getAssistantRuleFormObj(props.curInstance.NeedBindAssistantList, props.curInstance.loginData.AssistantList);
  }

  if (formRef.value) {
    formRef.value.resetFields();
    formRef.value.clearValidate();
  }
};

const selectedIds = computed(() => (ruleForm.value ? Object.values(ruleForm.value) : []));

watch(() => props.curInstance.NeedBindAssistantList, initForm, { immediate: true });

const submitForm = () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid) => {
    if (valid && ruleForm.value) {
      const List = getAssistantParamsList(ruleForm.value, props.curInstance.NeedBindAssistantList);

      const t = List.find((current, index) => {
        if (current.MemberID) return false;

        const next = List[index + 1];

        return next && current.TypeID === next.TypeID && next.MemberID;
      });

      if (t) {
        MpMessage.error('绑定失败', `请先设置 [ ${t.TypeName} ]`);
        return;
      }

      const temp = {
        EquipmentGroupID: props.curInstance.Equipment.GroupID,
        EquipmentID: props.curInstance.Equipment.ID,
        List: List.filter(it => !!it.MemberID),
      };

      const resp = await clientApi.getAssistantBindEquipment(temp);
      if (resp.data?.isSuccess) {
        emit('submited', List);
      }
    }
  });
};

const { state, onPasswordVerifyClick } = usePasswordVerify();
</script>

<style scoped lang='scss'>
.assistant-bind-form-wrap {
  width: 815px;
  min-height: 406px;
  margin: 0 auto;
  margin-top: 69px;
  box-shadow: 0px 0px 15px 1px rgba(0,0,0,0.16);
  border-radius: 8px 8px 8px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > header {
    padding-bottom: 30px;
    font-size: 20px;
    padding-top: 30px;
  }

  > main {
    margin-right: 160px;
    min-height: 120px;

    .password {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      position: relative;

      .error {
        margin-left: 15px;
        position: absolute;
        left: 100%;
        width: 190px;
        font-size: 12px;
      }

      .btn {
        width: 3em;
        margin-left: 10px;

        .is-success {
          font-size: 24px;
        }
      }
    }

    :deep(.el-form) {
      .el-form-item__label {
        white-space: nowrap;
        overflow: hidden;
        --el-form-label-font-size: 15px;

        .form-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          position: relative;
          padding-right: 12px;
          text-align: right;

          &::after {
            content: '：';
            position: absolute;
            right: -3px;
          }
        }
      }

      .el-input {
        font-size: 15px;
      }
    }
  }

  > footer {
    padding-bottom: 30px;
    margin-top: 10px;
    margin-left: 20px;
    button {
      margin-top: 28px;
      width: 290px;
      height: 60px;
      font-size: 30px;
      border-radius: 30px;
      margin-left: 20px;
    }
  }
}
</style>
