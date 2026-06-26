<template>
  <DialogContainerComp :visible='visible' :width='720' title='权限人负责情况设置' top='12vh' @cancel='visible = false'
    @open='onOpen' @submit='submit' @closed="onclosed">
    <div class='dialog-content'>
      <el-form ref="formRef" v-if="ruleForm" :model="ruleForm" label-width="130px" hide-required-asterisk>
        <el-form-item label="负责人：" prop="ID" :rules="[{ required: true, message: '请选择负责人' }]">
          <el-select v-model="ruleForm.ID" placeholder="请选择负责人" @change="onchange" filterable :disabled="!!item">
            <el-option v-for="it in staffList" :key="it.StaffID" :label="it.StaffName" :value="it.StaffID" :disabled="ids.includes(it.StaffID)" />
          </el-select>
        </el-form-item>

        <el-form-item label="生产线：" prop="lineIDs" :rules="[{ required: true, message: '请选择生产线' }]">
          <el-checkbox-group v-model="ruleForm.lineIDs">
            <el-checkbox v-for="line in localPrepressAdjModel.ProductionLineList" :key="line.ID" :label="line.ID"
             :title="line.Name" style="margin-right: 10px;">
              {{ line.Name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import api from '@/api';
import type { FormInstance } from 'element-plus';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IStaff } from '@/views/companyManage/StaffManage/js/types';
import { ref } from 'vue';
import { localPrepressAdjModel } from '../../store';
import { IAdjustPermissionInfo } from '../../types';
import { RuleForm } from '../model/ruleForm';

const props = defineProps<{
  item: null | IAdjustPermissionInfo
  ids: string[]
}>();

const emit = defineEmits(['submit']);

const visible = defineModel<boolean>('visible');

const ruleForm = ref<null | RuleForm>(null);

const formRef = ref<FormInstance>();

const staffList = ref<Pick<IStaff, 'StaffID' | 'StaffName'>[]>([]);

const onchange = () => {
  if (!ruleForm.value) return;
  const t = staffList.value.find(it => it.StaffID === ruleForm.value?.ID);
  ruleForm.value.Name = t?.StaffName || '';
};

const onclosed = () => {
  formRef.value?.clearValidate();
};

const onOpen = async () => {
  if (localPrepressAdjModel.value.ProductionLineList.length === 0) {
    localPrepressAdjModel.value.getProductionLineList();
  }

  ruleForm.value = new RuleForm(props.item);

  if (staffList.value.length === 0) {
    const resp = await api.getStaffSelect();
    if (resp.data?.isSuccess) {
      staffList.value = resp.data.Data;
    }
  }

  setTimeout(() => {
    formRef.value?.clearValidate();
  }, 20);
};

const submit = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid) => {
    if (valid) {
      const params = ruleForm.value?.getParams();
      if (params) {
        emit('submit', params);
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
  max-height: 500px;
  overflow: auto;
  overflow: overlay;
  @include scroll;

  :deep(.el-checkbox__label) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 12em;
    display: inline-block;
  }

  :deep(.el-form-item__label) {
    font-weight: 700;
    color: #444;
  }
}
</style>
