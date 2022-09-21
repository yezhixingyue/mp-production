<template>
  <el-form ref="ruleFormRef" v-if="ruleForm" :model="ruleForm" :rules="rules" class="ruleForm-box" label-width="140px">
    <el-form-item label="资源包名称：" prop="Name">
      <el-input v-model.trim="ruleForm.Name" maxlength="20" show-word-limit />
    </el-form-item>
    <el-form-item label="资源包性质：" prop="Feature">
      <el-radio-group v-model="ruleForm.Feature">
        <el-radio v-for="it in FeatureMenuList" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="包含物料类型：" prop="MaterialTypeGroups">
      <MaterialTypeGroupSelector v-model="ruleForm.MaterialTypeGroups" />
    </el-form-item>
    <el-form-item label="满足方式：" prop="MatchType">
      <el-radio-group v-model="ruleForm.MatchType">
        <el-radio v-for="it in MatchTypeMenuList" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
    </el-form-item>
      <!-- <span class="is-gray-light"><el-icon><WarningFilled /></el-icon>暂无数据，请先添加</span> -->
  </el-form>
</template>

<script setup lang='ts'>
import {
  IMaterialTypeItemInBundle, ResourceBundleClass, resourceBundleFeatureEnum, resourceBundleMatchEnum,
} from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import MaterialTypeGroupSelector from '@/components/productionResources/resourceBundle/Setup/MaterialTypeGroupSelector/MaterialTypeGroupSelector.vue';
import { getEnumList } from '@/assets/js/utils/getListByEnums';

const props = defineProps<{
  curEditItem: null | ResourceBundleClass,
}>();

const checkMaterialTypeGroups = (rule, value, callback) => {
  const list = value as IMaterialTypeItemInBundle[];
  const t = list.find(it => it.MaterialTypeIDS && it.MaterialTypeIDS.length > 0);
  if (t) {
    callback();
  } else {
    callback(new Error('请选择包含物料类型'));
  }
};

const FeatureMenuList = getEnumList(resourceBundleFeatureEnum);
const MatchTypeMenuList = getEnumList(resourceBundleMatchEnum);

const ruleFormRef = ref<FormInstance>();
const ruleForm = ref(new ResourceBundleClass(props.curEditItem));
const rules = reactive<FormRules>({
  Name: [
    { required: true, message: '请输入资源包名称', trigger: 'blur' },
  ],
  Feature: [
    { required: true, message: '请选择资源包性质', trigger: 'blur' },
  ],
  MatchType: [
    { required: true, message: '请选择满足方式', trigger: 'blur' },
  ],
  MaterialTypeGroups: [
    {
      type: 'array', required: true, message: '请选择包含物料类型', trigger: 'change',
    },
    { validator: checkMaterialTypeGroups, trigger: 'change' },
  ],
});

const getFormData = () => new Promise((resolve) => { // 校验 + 获取表单内容
  if (!ruleFormRef.value) {
    resolve(null);
    return;
  }
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      resolve(ruleForm.value);
    } else {
      resolve(null);
    }
  });
});
defineExpose({
  getFormData,
});

</script>

<style scoped lang='scss'>
  .ruleForm-box {
    width: 625px;
    max-height: 100%;
    overflow: auto;
    padding-right: 50px;
    :deep(.el-form-item__label) {
      color: #888E99;
    }
    .el-form-item {
      margin-bottom: 30px;
      .el-input {
        width: 410px;
      }
    }
  }
</style>
