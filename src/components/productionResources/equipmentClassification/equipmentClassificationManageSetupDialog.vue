<template>
  <DialogContainerComp v-model:visible='localVisible' autoClose :title="dialogTitle" @submit="submit" @open="onOpen" :width="600">
    <ul v-if="ruleForm" class="content-wrap">
      <li>
        <span class="label star">分类名称：</span>
        <el-input v-model.trim="ruleForm.Name" maxlength="10" show-word-limit></el-input>
      </li>
    </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { EquipmentClassificationItemClassType } from '@/views/productionResources/equipmentClassification/TypeClass/EquipmentClassificationItemClassType';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { computed, ref } from 'vue';

const props = defineProps<{
  visible: boolean,
  item: null | EquipmentClassificationListItem
  list: EquipmentClassificationListItem[]
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

const dialogTitle = computed(() => (props.item ? '编辑设备分类' : '添加设备分类'));

const ruleForm = ref<null | EquipmentClassificationItemClassType>(null);

const onOpen = () => {
  ruleForm.value = new EquipmentClassificationItemClassType(props.item);
};

const submit = () => {
  if (!ruleForm.value) return;
  const res = ruleForm.value.validate(props.list);
  if (!res) return;
  emit('submit', ruleForm.value);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/var.scss';

.content-wrap {
  text-align: center;
  padding: 20px;

  >li {
    padding: 4px 0 24px;

    >.label {
      color: $--color-gray;
      font-weight: 700;
      margin-right: 6px;
    }

    >.el-input {
      width: 320px;
      font-size: 12px;

      :deep(.el-input__wrapper) {
        border-radius: 3px;
      }
    }

    >.el-radio-group {
      width: 320px;
      vertical-align: -2px;
    }
  }
}
</style>
