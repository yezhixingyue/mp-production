<template>
  <el-form :model="ruleForm" ref="formRef" label-width="125px" class="demo-ruleForm" size="small"
    @submit.prevent>
    <el-form-item required label="设备类型" prop="Type">
      <el-select v-model="ruleForm.Type" style="width: 100%;">
        <el-option v-for="item in EquipmentTypeEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
      </el-select>
    </el-form-item>

    <el-form-item required label="设备编号" prop="code" :rules="[{ validator: ruleForm.validateField('code') }]">
      <el-input v-model.trim="ruleForm.code" autocomplete="off" maxlength="50"></el-input>
    </el-form-item>

    <!-- 购买来源 -->
    <el-form-item label="供应商" prop="supplier" :rules="[{ validator: ruleForm.validateField('supplier') }]">
      <el-input v-model="ruleForm.supplier" autocomplete="off" maxlength="50"></el-input>
    </el-form-item>

    <!-- 购买时间 -->
    <el-form-item label="采购时间" prop="purchaseAt" :rules="[{ validator: ruleForm.validateField('purchaseAt') }]">
      <el-date-picker v-model="ruleForm.purchaseAt" type="date" value-format="YYYY-MM-DD"
          placeholder="" :picker-options="{disabledDate: handleDisabledDate}" />
    </el-form-item>

    <!-- 保修过期时间 -->
    <el-form-item label="保修过期时间" prop="warrantyExpiredAt"
      :rules="[{ validator: ruleForm.validateField('warrantyExpiredAt') }, { validator: validateWarrantyExpiredAt }]">
      <el-date-picker v-model="ruleForm.warrantyExpiredAt" type="date" value-format="YYYY-MM-DD" placeholder="" />
    </el-form-item>

    <!-- 使用状态: 是否已启用 -->
    <el-form-item label="使用状态" prop="status">
      <el-checkbox v-model="ruleForm.status" :true-label="EquipmentStatusEnum.inUse"
        :false-label="EquipmentStatusEnum.leisure">使用中</el-checkbox>
    </el-form-item>

    <!-- 使用人信息 -->
    <el-form-item :required="ruleForm.status===EquipmentStatusEnum.inUse" label="使用人" prop="user" :rules="[{ validator: ruleForm.validateField('user') }]">
      <el-select v-model="ruleForm.user" filterable style="width: 100%;" :disabled="ruleForm.status !== EquipmentStatusEnum.inUse">
        <el-option v-for="item in staffList" :key="item.StaffID" :label="item.StaffName" :value="item.StaffID" />
      </el-select>
    </el-form-item>

    <!-- 备注 -->
    <el-form-item label="备注" prop="remark" :rules="[{ validator: ruleForm.validateField('remark') }]">
      <el-input v-model="ruleForm.remark" type="textarea" autocomplete="off" maxlength="80" :rows="5"></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { EquipmentFormClass } from '../../../model/ruleForm/EquipmentFormClass';
import { IPartialToolsStaff } from '../../../hooks/useStaffList';
import { EquipmentStatusEnum, EquipmentTypeEnumList } from '../../../types/enum';

const props = defineProps<{
  form: Required<EquipmentFormClass>
  staffList: IPartialToolsStaff[]
}>();

const ruleForm = computed(() => props.form);
const formRef = ref();

/** 补充校验: */
const validateWarrantyExpiredAt = (rule: unknown, value: unknown, callback: (error?: string | Error) => void) => {
  if (ruleForm.value.warrantyExpiredAt && ruleForm.value.purchaseAt && new Date(ruleForm.value.warrantyExpiredAt) < new Date(ruleForm.value.purchaseAt)) {
    callback(new Error('保修到期时间不能早于采购时间'));
    return;
  }

  callback();
};

/** 采购日期不能晚于今天 */
const handleDisabledDate = (e) => new Date(e) > new Date();

defineExpose({
  validate: () => {
    if (formRef.value) {
      return formRef.value.validate().catch(() => false) as Promise<boolean>;
    }

    return false;
  },
});
</script>

<style scoped lang='scss'>
</style>
