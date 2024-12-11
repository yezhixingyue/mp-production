<template>
  <el-form :model="ruleForm" ref="formRef" label-width="128px" class="demo-ruleForm" size="small"
    v-if="ruleForm && ruleForm" @submit.prevent>

    <el-form-item required label="cpu型号" prop="cpu" :rules="[{ validator: ruleForm.validateField('cpu') }]">
      <el-input v-model="ruleForm.cpu" autocomplete="off" maxlength="50"></el-input>
    </el-form-item>

    <el-form-item required label="内存插槽数量" prop="memorySlotsNumber"
      :rules="[{ validator: ruleForm.validateField('memorySlotsNumber') }]">
      <el-input v-model.number="ruleForm.memorySlotsNumber" autocomplete="off" maxlength="2"></el-input>
    </el-form-item>

    <el-form-item required label="内存" prop="memory" :rules="[{ validator: ruleForm.validateField('memory') }]">
      <el-input v-model="ruleForm.memory" autocomplete="off" maxlength="50"></el-input>
    </el-form-item>

    <el-form-item required label="硬盘数量" prop="diskNumber"
      :rules="[{ validator: ruleForm.validateField('diskNumber') }]">
      <el-input v-model.number="ruleForm.diskNumber" autocomplete="off" maxlength="2"></el-input>
    </el-form-item>

    <el-form-item required label="硬盘型号" prop="disk" :rules="[{ validator: ruleForm.validateField('disk') }]">
      <el-input v-model="ruleForm.disk" autocomplete="off" maxlength="50"></el-input>
    </el-form-item>

    <el-form-item required label="显卡" prop="graphicsCard"
      :rules="[{ validator: ruleForm.validateField('graphicsCard') }]">
      <el-input v-model="ruleForm.graphicsCard" autocomplete="off" maxlength="50"></el-input>
    </el-form-item>

    <el-form-item required label="网卡" prop="networkCard"
      :rules="[{ validator: ruleForm.validateField('networkCard') }]">
      <el-input v-model="ruleForm.networkCard" autocomplete="off" maxlength="50"></el-input>
    </el-form-item>
    <el-form-item required label="操作系统" prop="os" :rules="[{ validator: ruleForm.validateField('os') }]">
      <el-input v-model="ruleForm.os" autocomplete="off" maxlength="50"></el-input>
    </el-form-item>

    <el-form-item required label="系统盘类型" prop="systermDiskType"
      :rules="[{ validator: ruleForm.validateField('systermDiskType') }]">
      <el-input v-model.trim="ruleForm.systermDiskType" autocomplete="off" maxlength="50"></el-input>
    </el-form-item>

    <el-form-item required label="mac地址" prop="mac" :rules="[{ validator: ruleForm.validateField('mac') }]">
      <el-input v-model.trim="ruleForm.mac" autocomplete="off" maxlength="50"></el-input>
    </el-form-item>

    <el-form-item label="ip地址" prop="ip" :rules="[{ validator: ruleForm.validateField('ip') }]">
      <el-input v-model.trim="ruleForm.ip" autocomplete="off" maxlength="50"></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { ComputerAttrClass } from '@/views/companyManage/EquipmentManage/EquipmentList/model/ruleForm/adapter/ComputerAttrClass';

const props = defineProps<{
  form: ComputerAttrClass
}>();

const ruleForm = computed(() => props.form);
const formRef = ref();

defineExpose({
  validate: () => formRef.value?.validate() || false,
});
</script>

<style scoped lang='scss'>
</style>
