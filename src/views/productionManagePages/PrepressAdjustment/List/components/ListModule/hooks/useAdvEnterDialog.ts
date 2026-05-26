import { IAdjustInfo } from '@/views/productionManagePages/PrepressAdjustment/types';
import { ref } from 'vue';
import { AdjustListManageModel } from '../../../model/AdjustListManageModel';

export const useAdvEnterDialog = (props: { moduleData: AdjustListManageModel }) => {
  const advEnterVisible = ref(false);

  const advEnterItem = ref<null | IAdjustInfo>(null);

  const onAdvEnterClick = (item: IAdjustInfo) => {
    advEnterItem.value = item;
    advEnterVisible.value = true;
  };

  const submitAdvEnter = async (Remark: string) => {
    if (!Remark || !advEnterItem.value) return;

    props.moduleData.submitAdvEnter(Remark, advEnterItem.value, () => {
      advEnterVisible.value = false;
    });
  };

  return { advEnterVisible, advEnterItem, onAdvEnterClick, submitAdvEnter };
};
