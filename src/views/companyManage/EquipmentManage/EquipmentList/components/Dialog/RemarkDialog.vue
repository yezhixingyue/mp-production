<template>
  <DialogContainerComp class="dialog" :width="512" top="15vh" :title="`设置设备${operationTypeText}信息`"
    v-model:visible="localVisible" :danger="showDanger" :primaryText="showDanger ? operationTypeText : undefined"
    @open="open" @submit="submit" @danger="submit" @cancel="cancel">
    <el-form :model="ruleForm" ref="formRef" class="form" label-width="85px" style="margin-right: 10px;" size="small"
      v-if="ruleForm" @submit.prevent>
      <!-- 输入框 -->
      <el-form-item required label="备注：" prop="content" :rules="[{ required: true, message: '请输入备注内容' }]">
        <el-input type="textarea" :rows="10" v-model.trim="ruleForm.content"
          :placeholder="`请输入文字备注，记录设备${operationTypeText}信息，后续可在设备历史记录中查询`" maxlength="200" show-word-limit></el-input>
      </el-form-item>

      <!-- 警告 -->
      <el-form-item v-if='showDanger' style="margin-bottom: -30px;line-height: 20px;">
        <span class="danger">
          提交后，设备将变更为{{ operationTypeText }}状态并移除使用人信息
          <template v-if="props.type === EquipmentHistoryTypeEnum.abandon">，此操作不可逆转，请谨慎执行本操作!</template>
        </span>
      </el-form-item>

      <!-- 使用状态: 是否已启用 -->
      <el-form-item label="使用状态" class="use-state" prop="status" v-if="type === EquipmentHistoryTypeEnum.callin" style="height: 48px;">
        <!-- 设置使用状态 -->
        <el-col :span="6">
          <el-form-item>
            <el-checkbox v-model="ruleForm.status" :true-label="EquipmentStatusEnum.inUse"
              :false-label="EquipmentStatusEnum.leisure">使用中</el-checkbox>
          </el-form-item>
        </el-col>

        <!-- 使用人信息 -->
        <el-col :span="18">
          <el-form-item required label="使用人" prop="user" style="position: relative;top: -1px;"
            :rules="[{ required: true, message: '请选择使用人' }]"
            v-if="ruleForm.status === EquipmentStatusEnum.inUse && type === EquipmentHistoryTypeEnum.callin">
            <el-select v-model="ruleForm.user" filterable style="width: 150px;top: -2px;">
              <el-option v-for="item in staffList" :key="item.StaffID" :label="item.StaffName" :value="item.StaffID" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

    </el-form>
  </DialogContainerComp>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { useUserStore } from '@/store/modules/user';
import { useStaffList } from '../../hooks/useStaffList';
import { EquipmentStatusEnum, EquipmentHistoryTypeEnum, EquipmentHistoryTypeEnumList } from '../../types/enum';
import { TEquipment, ICallinStateInfo, IRemarkSubmitParams } from '../../types';

const props = defineProps<{
  visible: boolean
  row: null | TEquipment
  type: EquipmentHistoryTypeEnum
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

const { staffList } = useStaffList();
const operationTypeText = computed(() => EquipmentHistoryTypeEnumList.find(it => it.ID === props.type)?.Name);
const showDanger = computed(() => [EquipmentHistoryTypeEnum.abandon, EquipmentHistoryTypeEnum.callout].includes(props.type));

const formRef = ref();
const ruleForm = ref({ content: '', status: EquipmentStatusEnum.inUse, user: '' });

const open = async () => {
  try {
    if (formRef.value) formRef.value.resetFields();
  // eslint-disable-next-line no-empty
  } catch (error) {}

  ruleForm.value = { content: '', status: EquipmentStatusEnum.inUse, user: '' };
};

const cancel = () => {
  localVisible.value = false;
};

const submit = async () => {
  if (!ruleForm.value || !formRef.value) return;

  const bool = await formRef.value.validate().catch(() => false);

  if (bool) {
    const data: IRemarkSubmitParams = {
      content: ruleForm.value.content,
      creator: useUserStore().user?.StaffID || '',
      equipmentId: props.type === EquipmentHistoryTypeEnum.create ? undefined : props.row?.id || '',
      type: props.type,
    };
    const callinStateData: ICallinStateInfo | undefined = props.type === EquipmentHistoryTypeEnum.callin ? { ...ruleForm.value } : undefined;
    emit('submit', data, callinStateData);
  }
};
</script>
<style lang='scss' scoped>
.form {
  :deep(.el-form-item__content) {
    .danger {
      color: #ff3769;
      font-size: 12px;
      line-height: 20px;
      display: inline-block;
      // letter-spacing: 0.5px;
    }
  }

  .use-state {
    margin-top: -6px;
    > :deep(.el-form-item__label) {
      margin-top: 11px;
      padding-right: 16px;
    }
  }
}
</style>
