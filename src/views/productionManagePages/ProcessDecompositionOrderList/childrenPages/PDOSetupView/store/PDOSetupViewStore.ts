import { ref } from 'vue';
import { PDOSetupClass, TPDOSetupClass } from '../model/PDOSetupClass';
import { IPDOrderItem } from '../../../types/types';
import { TProductionLineListData } from '../../../js/getProductionLineList';

export const PDOSetupViewStore = ref<null | TPDOSetupClass>(null);

/** 审核页面仓库数据初始赋值 */
export const initPDOSetupViewStore = (row: IPDOrderItem, lineListData: TProductionLineListData) => {
  PDOSetupViewStore.value = new PDOSetupClass(row, lineListData);
};
