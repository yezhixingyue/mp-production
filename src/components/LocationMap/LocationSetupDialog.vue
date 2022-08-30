<template>
  <DialogContainerComp
    title="设置货位名称"
    :visible='visible'
    :width="460"
    :primaryClick="submitForm"
    :closeClick="handleClose"
    :open="onOpen"
    :top="'10vh'"
    >
    <template #default>
      <div class="name-dialog">
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">
          <el-form-item :label="`货位名称：`" prop="PositionName">
            <el-input v-model="ruleForm.PositionName" maxlength="10" show-word-limit />
          </el-form-item>
        </el-form>
      </div>
    </template>
  </DialogContainerComp>
</template>

<script lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { reactive, ref } from 'vue';
import { FormInstance, FormRules } from 'element-plus';
import { LocationSetClass } from './LocationSetClass';
import { IDialogRuleForm } from './types';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    curLocation: {
      type: Object,
      default: null,
    },
    locationSet: {
      type: Array,
      default: () => [] as LocationSetClass[],
    },
  },
  emits: ['update:visible', 'submit'],
  components: {
    DialogContainerComp,
  },
  setup(props, ctx) {
    const ruleFormRef = ref<FormInstance>();

    const handleClose = () => {
      ctx.emit('update:visible', false);
    };

    const ruleForm = reactive<IDialogRuleForm>({
      PositionID: '',
      PositionName: '',
    });

    const checkNameRepeat = (rule, value: string, callback) => {
      const _locationSet = props.locationSet as LocationSetClass[];
      const t = _locationSet.find(it => it.PositionName === value);
      if (t) {
        callback(new Error('货位名称重复!'));
        return;
      }
      callback();
    };

    const rules = reactive<FormRules>({
      PositionName: [
        { required: true, message: '请输入货位名称', trigger: 'blur' },
        { validator: checkNameRepeat, trigger: 'blur' },
      ],
    });

    const onOpen = () => {
      if (ruleFormRef.value) ruleFormRef.value.resetFields();
      if (props.isEdit) {
        const location = props.curLocation as LocationSetClass | null;
        if (location) {
          ruleForm.PositionID = location.PositionID;
          ruleForm.PositionName = location.PositionName;
        }
      }
    };

    const submitForm = () => {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          ctx.emit('submit', ruleForm);
        }
      });
    };

    return {
      onOpen,
      handleClose,
      submitForm,
      rules,
      ruleForm,
      ruleFormRef,
    };
  },
};
</script>
<style lang='scss'>
</style>
