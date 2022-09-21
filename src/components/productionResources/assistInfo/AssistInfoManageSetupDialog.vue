<template>
  <DialogContainerComp v-model:visible='localVisible' autoClose :title="dialogTitle" @submit="submit" @open="onOpen" :width="600">
    <ul v-if="ruleForm" class="content-wrap">
      <li>
        <span class="label">名称：</span>
        <el-input v-model.trim="ruleForm.Name" maxlength="20" show-word-limit></el-input>
      </li>
      <li>
        <span class="label">类型：</span>
        <el-radio-group v-model="ruleForm.Type" size="small">
          <el-radio class="ft-12" v-for="it in radioMenus" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
        </el-radio-group>
      </li>
    </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { getEnumList } from '@/assets/js/utils/getListByEnums';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { AssistInfoItem } from '@/views/productionResources/assistInfo/TypeClass/assistInfoItem';
import { AssistInfoTypeEnums } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { IAssistListItem } from '@/views/productionResources/assistInfo/types';
import { computed, ref } from 'vue';

const props = defineProps<{
  visible: boolean,
  item: null | IAssistListItem
  list: IAssistListItem[]
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

const dialogTitle = computed(() => (props.item ? '编辑辅助信息' : '添加辅助信息'));

const radioMenus = getEnumList(AssistInfoTypeEnums);

const ruleForm = ref<null | AssistInfoItem>(null);

const onOpen = () => {
  ruleForm.value = new AssistInfoItem(props.item);
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
