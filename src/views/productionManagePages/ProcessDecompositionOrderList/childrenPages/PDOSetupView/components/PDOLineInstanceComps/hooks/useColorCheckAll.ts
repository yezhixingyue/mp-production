import { computed, ComputedRef } from 'vue';
import { PrintColorEnumList } from '@/views/productionManagePages/ManualOrderHandlerPage/js/EnumList';
import { PDOLineInstanceType } from '../../../model/Instance';

export const useColorCheckAll = (instanceItem: ComputedRef<PDOLineInstanceType>) => {
  const isColorCheckAll = computed({
    get: () => instanceItem.value.ColorList.length === PrintColorEnumList.length
        && PrintColorEnumList.every(it => instanceItem.value.ColorList.some((colorID) => it.ID === colorID)),
    set: (value) => {
      const _instanceItem = instanceItem;
      _instanceItem.value.ColorList = value ? PrintColorEnumList.map(it => it.ID) : [];
    },
  });

  const isColorCheckIndeterminate = computed(() => !isColorCheckAll.value && instanceItem.value.ColorList.length > 0);

  return { isColorCheckAll, isColorCheckIndeterminate };
};
