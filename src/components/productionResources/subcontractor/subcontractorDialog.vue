<template>
  <DialogContainerComp v-model:visible='localVisible' autoClose :title="dialogTitle" @submit="submit" @open="onOpen" :width="700" top="12vh">
    <el-form ref="ruleFormRef" v-if="ruleForm" :model="ruleForm" :rules="rules" class="ruleForm-box" label-width="160px">
      <el-form-item label="工厂名称：" prop="Name">
        <el-input v-model.trim="ruleForm.Name" maxlength="20" show-word-limit />
      </el-form-item>
      <el-form-item label="所在城市：" prop="CityID">
        <Level2LocationSelector v-model:ProvinceID="ruleForm.ProvinceID" v-model:CityID="ruleForm.CityID" />
      </el-form-item>
      <el-form-item label="详细地址：" prop="DetailAddress">
        <el-input type="textarea" :rows="2" v-model.trim="ruleForm.DetailAddress" maxlength="60" show-word-limit />
      </el-form-item>
      <el-form-item label="联系人：" prop="LinkMan">
        <el-input v-model.trim="ruleForm.LinkMan" maxlength="10" show-word-limit />
      </el-form-item>
      <el-form-item label="联系电话：" prop="Mobile">
        <el-input v-model.trim="ruleForm.Mobile" maxlength="13" show-word-limit />
      </el-form-item>
      <el-form-item label="适用于设备分类：" prop="ClassIDS">
        <el-checkbox-group v-model="ruleForm.ClassIDS" v-if="props.EquipmentClassList.length > 0">
          <el-checkbox v-for="it in props.EquipmentClassList" :key="it.ID" :label="it.ID">{{it.Name}}</el-checkbox>
        </el-checkbox-group>
        <span v-else class="is-gray-light"><el-icon><WarningFilled /></el-icon>暂无数据，请先添加</span>
      </el-form-item>
    </el-form>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { ISubcontractorFactoryListItemType, SubcontractorFactory } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorFactory';
import { FormInstance, FormRules } from 'element-plus';
import {
  computed, defineAsyncComponent, reactive, ref,
} from 'vue';

const Level2LocationSelector = defineAsyncComponent(() => import('@/components/common/SelectComps/Level2AdLocationSelector.vue'));

const props = defineProps<{
  visible: boolean,
  item: null | ISubcontractorFactoryListItemType,
  EquipmentClassList: EquipmentClassificationListItem[],
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

const dialogTitle = computed(() => (props.item ? '编辑外协工厂' : '添加外协工厂'));

const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<null | SubcontractorFactory>(null);
const rules = reactive<FormRules>({
  Name: [
    { required: true, message: '请输入工厂名称', trigger: 'blur' },
  ],
  DetailAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
  ],
  LinkMan: [
    { required: true, message: '请输入联系人', trigger: 'blur' },
  ],
  Mobile: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^\d{11}$|^\d{7,12}$|^\d{3,4}-\d{6,8}$/, message: '电话号码格式不正确', trigger: 'blur' },
  ],
  CityID: [
    { required: true, message: '请输入所在城市', trigger: 'change' },
  ],
  ClassIDS: [
    {
      type: 'array', required: true, message: '请选择适用于设备分类', trigger: 'change',
    },
  ],
});

const onOpen = async () => {
  ruleForm.value = new SubcontractorFactory(props.item);
  if (ruleFormRef.value) ruleFormRef.value.resetFields();
};

const submit = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      emit('submit', ruleForm.value);
    }
  });
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/var.scss';
@import '@/assets/css/mixins.scss';

.ruleForm-box {
  padding-bottom: 20px;
  min-height: 400px;
  .el-textarea, .el-input {
    font-size: 12px;
    width: 425px;
  }
  input, textarea {
    color: #444;
  }
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    max-height: 200px;
    width: 480px;
    overflow: auto;
    @include scroll;
    .el-checkbox {
      display: flex;
      align-items: center;
      margin-right: 10px;
      :deep(.el-checkbox__label) {
        width: 10em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  :deep(.el-form-item__label) {
    color: #888;
    font-weight: 700;
  }
  .is-gray-light > i {
    vertical-align: -2px;
    margin-right: 4px;
    font-size: 14px;
  }
}
</style>
