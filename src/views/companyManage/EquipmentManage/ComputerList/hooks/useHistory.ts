import { ref } from 'vue';
import { IComputer } from '../types/type';

export const useHistory = () => {
  const history = ref<{ visible: boolean; row: null | IComputer }>({
    visible: false,
    row: null,
  });

  const onHistoryClick = (row: IComputer) => {
    history.value.row = row;
    history.value.visible = true;
  };

  return { history, onHistoryClick };
};
