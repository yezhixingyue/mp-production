import { ref } from 'vue';
import { IImpAllocationListItem } from '../types/types';

export const useDialogVisible = () => {
  const visible = ref(false);

  const currentRow = ref<IImpAllocationListItem | null>(null);

  const showDialog = (row: IImpAllocationListItem) => {
    currentRow.value = row;
    visible.value = true;
  };

  return { visible, currentRow, showDialog };
};
