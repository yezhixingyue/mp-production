import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { ref } from 'vue';

type RowType = ReturnType<typeof getLocalTaskList>[number];

/** 待外协加工信息修改hook */
export const useAssistTextChange = () => {
  const state = ref({
    visible: false,
    row: null as null | RowType,
  });

  const onAssistTextChangeClick = (row: RowType) => {
    state.value.row = row;
    state.value.visible = true;
  };

  return { assistTextChangeState: state, onAssistTextChangeClick };
};
