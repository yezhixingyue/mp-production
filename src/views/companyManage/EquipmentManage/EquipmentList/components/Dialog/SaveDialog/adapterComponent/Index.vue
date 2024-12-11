<template>
  <ComputerTypeForm :form="form.attribute as ComputerAttrClass" v-if="form.attribute && form.Type === EquipmentTypeEnum.computer" ref="formRef" />
  <DisplayerTypeForm :form="form.attribute as DisplayerAttrClass" v-else-if="form.attribute && form.Type === EquipmentTypeEnum.displayer" ref="formRef" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { EquipmentFormClass } from '../../../../model/ruleForm/EquipmentFormClass';
import { EquipmentTypeEnum } from '../../../../types/enum';
import ComputerTypeForm from './components/ComputerTypeForm.vue';
import DisplayerTypeForm from './components/DisplayerTypeForm.vue';
import { ComputerAttrClass } from '../../../../model/ruleForm/adapter/ComputerAttrClass';
import { DisplayerAttrClass } from '../../../../model/ruleForm/adapter/DisplayerAttrClass';

defineProps<{
  form: Required<EquipmentFormClass>
}>();

const formRef = ref();

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
