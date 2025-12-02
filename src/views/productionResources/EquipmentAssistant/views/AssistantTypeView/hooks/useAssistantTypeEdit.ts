import { Ref, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { IAssistantType } from '../../../types/types';
import { AssistantTypeManageClass } from '../model/AssistantTypeManageClass';
import { TypeEditRuleForm } from '../model/ruleForm';

export const useAssistantTypeEdit = (localTypeManageData: Ref<AssistantTypeManageClass>) => {
  const visible = ref(false);

  const currentAssistantType = ref<null | IAssistantType>(null);

  const onTypeEditClick = (item: null | IAssistantType) => {
    currentAssistantType.value = item;
    visible.value = true;
  };

  const handleTypeUpsertSubmit = async (data: TypeEditRuleForm) => {
    if (await localTypeManageData.value.upsert(data)) {
      visible.value = false;
      ElMessage.success(data.ID === '' ? '新增成功' : '编辑成功');
    }
  };

  return {
    visible,
    currentAssistantType,
    onTypeEditClick,
    handleTypeUpsertSubmit,
  };
};
