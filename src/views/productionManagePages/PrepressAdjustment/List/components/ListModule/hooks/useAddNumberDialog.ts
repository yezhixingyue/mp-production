import { ref } from 'vue';
import { AddNumberRuleForm } from '../model/AddNumberRuleForm';
import { AdjustListManageModel } from '../../../model/AdjustListManageModel';

export const useAddNumberDialog = (props: { moduleData: AdjustListManageModel }) => {
  const addNumberVisible = ref(false);

  const onAddNumberClick = () => {
    addNumberVisible.value = true;
  };

  const submitAddNumber = (e: ReturnType<AddNumberRuleForm['getParams']>) => {
    if (!e) return;

    props.moduleData.addNumber(e, () => {
      addNumberVisible.value = false;
    });
  };

  return { addNumberVisible, onAddNumberClick, submitAddNumber };
};
