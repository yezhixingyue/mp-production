<template>
  <DialogContainerComp class="dialog" :width="860" top="6vh" :title="`${!!item ? '编辑' : '添加'}设备`" v-model:visible="localVisible" @open="open" @closed="closed"
    @submit="submit" @cancel="cancel">
    <div class="dialog-content">
      <!-- 左侧设备通用信息 -->
      <LeftCommonInfoForm ref="commonFormRef" v-if="ruleForm" :form="ruleForm" :staffList="staffList" />

      <!-- 右侧设备相关属性信息 -->
      <Adapter ref="adapterRef" v-if="ruleForm" :form="ruleForm" />
    </div>
  </DialogContainerComp>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { useStaffList } from '../../../hooks/useStaffList';
import { EquipmentFormClass } from '../../../model/ruleForm/EquipmentFormClass';
import { TEquipment } from '../../../types';
import LeftCommonInfoForm from './LeftCommonInfoForm.vue';
import Adapter from './adapterComponent/Index.vue';

const props = defineProps<{
  visible: boolean
  item: null | TEquipment
  type: number | string
}>();

const emit = defineEmits(['update:visible', 'submit']);

const { staffList } = useStaffList();

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const ruleForm = ref<null | EquipmentFormClass>(null);
const commonFormRef = ref();
const adapterRef = ref();

const open = () => {
  ruleForm.value = new EquipmentFormClass(props.item, props.type);
};

const closed = () => {
  ruleForm.value = null;
};

const cancel = () => {
  localVisible.value = false;
};

const submit = async () => {
  if (!ruleForm.value || !commonFormRef.value || !adapterRef.value) return;

  const [bool1, bool2] = await Promise.all([commonFormRef.value.validate(), adapterRef.value.validate()]);

  if (bool1 && bool2) {
    const params = ruleForm.value.getParams();
    if (!params) return;

    emit('submit', params);
  }
};
</script>
<style lang='scss' scoped>
@import '@/assets/css/mixins.scss';

.dialog-content {
  display: flex;
  padding-left: 30px;
  margin: 0 auto;
  min-height: 528px;

  > form {
    width: 348px;

    --el-component-size-small: 30px;
    --el-border-radius-base: 2px;

    :deep(label.el-form-item__label) {
      font-size: 13px;
    }

    :deep(.el-select .el-input.is-disabled .el-input__inner) {
      color: rgba(0, 0, 0, 0);
      opacity: 0;
    }

    :deep(.el-textarea__inner) {
      border-radius: 2px;
      padding-right: 4px;
      max-height: 120px;
      @include scroll;
    }
  }
}
</style>
