import { ref } from 'vue';
import { IAssistantInfo } from '../types/types';

export const useItemUpsert = () => {
  const visible = ref(false);

  const targetItem = ref<null | IAssistantInfo>(null);

  /** 新增|编辑事件 */
  const onItemUpsertClick = (row: null | IAssistantInfo) => {
    targetItem.value = row;
    visible.value = true;
  };

  return { visible, targetItem, onItemUpsertClick };
};
