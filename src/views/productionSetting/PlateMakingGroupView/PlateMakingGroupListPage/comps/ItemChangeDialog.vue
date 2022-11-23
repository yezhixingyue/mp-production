<template>
  <DialogContainerComp
    :title="`${ruleForm.ID ? '编辑' : '添加'}制版组`"
    :visible='localVisible'
    :width="450"
    @open="onOpen"
    @submit="submit"
    @cancel="localVisible = false"
    @closed="resetForm"
    >
    <el-form ref="formRef" :model="ruleForm" label-width="88px">
      <el-form-item
        label="组名称："
        prop="Name"
        :rules="[
          { required: true, message: '请输入制版组名称' },
          { validator: validateNameRepeat, message: '制版组名称重复，请检查' },
        ]"
      >
        <el-input class="input" v-model.trim="ruleForm.Name" placeholder="请输入制版组名称" maxlength="12" show-word-limit></el-input>
      </el-form-item>
    </el-form>
  </DialogContainerComp>
</template>
<script setup lang="ts">
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { FormInstance } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import { IPlateMakingGroup } from '../../js/types';

const props = defineProps<{
  visible: boolean
  curEditItem: null | IPlateMakingGroup
  list: IPlateMakingGroup[]
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const formRef = ref<FormInstance>();

const ruleForm = reactive({
  ID: '',
  Name: '',
});

const onOpen = () => {
  ruleForm.ID = props.curEditItem?.ID || '';
  ruleForm.Name = props.curEditItem?.Name || '';
};

const resetForm = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
};

const validateNameRepeat = (rule, value: string, callback: (err?: Error) => void) => {
  const t = props.list.find(it => it.ID !== ruleForm.ID && it.Name === ruleForm.Name);
  if (t) {
    callback(new Error());
    return;
  }
  callback();
};

const submit = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', ruleForm);
    }
  });
};

</script>
<style lang="scss" scoped>
.input {
  width: 313px;
}
</style>
