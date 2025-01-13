import { ref } from 'vue';
import { IManagePlateInfo } from './type';

export const useErrorFileTest = () => {
  const fileTestState = ref({
    visible: false,
    row: null as null | IManagePlateInfo,
  });

  const onErrorFileTestClick = (row: IManagePlateInfo) => {
    fileTestState.value.row = row;
    fileTestState.value.visible = true;
  };

  return { fileTestState, onErrorFileTestClick };
};
