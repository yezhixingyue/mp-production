import { ref } from 'vue';
import { IAdjustPermissionInfo } from '../../types';

export const useDialog = () => {
  const visible = ref(false);

  const currentItem = ref<null | IAdjustPermissionInfo>(null);

  const onEditClick = (item: null | IAdjustPermissionInfo) => {
    currentItem.value = item;
    visible.value = true;
  };

  return { visible, currentItem, onEditClick };
};
