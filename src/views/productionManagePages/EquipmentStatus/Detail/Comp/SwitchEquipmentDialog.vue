<template>
 <DialogContainerComp
   :visible='localVisible'
   :width='600'
   :loading="loading"
   :disabled="curEquipmentID===curTaskItem?.Equipment.ID"
   title='请选择要更换的设备：'
   top='12vh'
   @open='onOpen'
   @cancel='localVisible = false'
   @submit='submit'
   >
   <div class='dialog-content' v-if="curTaskItem" v-loading="loading">
    <el-empty v-if="!loading && (!EquipmentList || EquipmentList.length === 0)" description="暂无可更换设备" />
    <el-radio-group v-else v-model="curEquipmentID">
      <el-radio v-for="equ in EquipmentList" :key="equ.ID" :label="equ.ID" :disabled="equ.ID===curTaskItem?.Equipment.ID">{{ equ.Name }}</el-radio>
    </el-radio-group>
   </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import api from '@/api';
import { IBaseProperty } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';

const props = defineProps<{
  visible: boolean
  curTaskItem: null | ReturnType<typeof getLocalTaskList>[number]
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

const EquipmentList = ref<IBaseProperty<string>[]>([]);
const loading = ref(false);
const curEquipmentID = ref('');
const getEquipmentList = async () => {
  // 1. 清空旧的设备列表和还原当前选中的设备ID

  EquipmentList.value = [];
  curEquipmentID.value = '';

  // 2. 重新获取要更换的设备列表

  const TaskWorkingID = props.curTaskItem?.Working.TaskWorkingID;
  if (!TaskWorkingID) return;

  loading.value = true;
  const resp = await api.productionManageApis.getTaskUseableEquipmentList(TaskWorkingID).catch(() => null);
  loading.value = false;

  if (resp?.data?.isSuccess) {
    EquipmentList.value = resp.data.Data || [];

    // 对curEquipmentID进行重新赋值： 1 找到原始值  2 看是否在列表中  3 如果在则予以赋值
    const id = props.curTaskItem.Equipment.ID;
    const t = EquipmentList.value.find(it => it.ID === id);
    if (t) {
      curEquipmentID.value = id;
    }
  }
};

const onOpen = () => {
  getEquipmentList();
};

const submit = () => {
  // 1. 校验
  if (!curEquipmentID.value) {
    MpMessage.error('保存失败', '未选择设备');
    return;
  }
  // 2. 提交
  emit('submit', curEquipmentID.value);
  // 3. 提交后对数据的修改 MpMessage.dialogSuccess - 外部修改
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -15px;
  min-height: 300px;
  max-height: 360px;
  overflow: auto;
  overflow: overlay;

  @include scroll;

  :deep(.el-empty__description p) {
    font-size: 13px;
  }
}
</style>
