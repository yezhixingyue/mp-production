<template>
  <el-form :model="ruleForm" ref="formRef" label-width="128px" class="demo-ruleForm" size="small"
    v-if="ruleForm" @submit.prevent>
    <el-form-item required label="显示器型号" prop="model" :rules="[{ validator: ruleForm.validateField('model') }]">
      <el-input v-model="ruleForm.model" autocomplete="off" maxlength="50"></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { DisplayerAttrClass } from '@/views/companyManage/EquipmentManage/EquipmentList/model/ruleForm/adapter/DisplayerAttrClass';

const props = defineProps<{
  form: DisplayerAttrClass
}>();

const ruleForm = computed(() => props.form);
const formRef = ref();

defineExpose({
  validate: () => formRef.value?.validate() || false,
});
</script>

<style scoped lang='scss'>
</style>
