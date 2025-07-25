import api from '@/api';
import { ref } from 'vue';
import { IPDOrderItem, TCraftResolveDetail } from '../../types/types';

export class PDODetailViewStoreClass {
  rowItem: IPDOrderItem

  craftResolveDetail: null | TCraftResolveDetail = null

  constructor(item: IPDOrderItem) {
    this.rowItem = item;
  }

  async getCraftResolveDetail() {
    if (!this.rowItem.HaveDetail) {
      return;
    }

    const resp = await api.productionManageApis.getCraftResolveDetail(this.rowItem.ID);

    if (resp.data?.isSuccess) {
      this.craftResolveDetail = resp.data.Data;
    }
  }
}

export const PDODetailViewStore = ref<null | PDODetailViewStoreClass>(null);

export const initPDODetailViewStore = (item: IPDOrderItem) => {
  PDODetailViewStore.value = new PDODetailViewStoreClass(item);
};
