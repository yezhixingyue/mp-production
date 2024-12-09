import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { ref } from 'vue';
import { ManageListClass } from '../../js/ManageListClass';

export const useIssue = () => {
  const visible = ref(false);

  const curIssueRow = ref<null | ReturnType<typeof getLocalTaskList>[number]>(null);

  const onIssueClick = (row: ReturnType<typeof getLocalTaskList>[number]) => {
    curIssueRow.value = row;

    visible.value = true;
  };

  const onIssueSubmit = (content: string, ManageListData: Required<ManageListClass>) => {
    if (!curIssueRow.value) return;

    ManageListData.setQuestion(curIssueRow.value, content, () => {
      visible.value = false;
    });
  };

  return { onIssueClick, visible, curIssueRow, onIssueSubmit };
};
