import { nextTick } from 'vue';
import api from '@/api';
import { IPDOrderItem } from '../types/types';
import { PDOCondition } from './PDOCondition';
import { TProductionLineListData, getProductionLineList } from './getProductionLineList';

export class PDOListManageClass {
  condition = new PDOCondition()

  list: IPDOrderItem[] = []

  listNumber = 0

  loading = false

  clearCondition() {
    this.condition = new PDOCondition();
  }

  async getList(Page = 1) {
    this.condition.Page = Page;

    this.list = [];

    this.loading = true;
    const temp = this.condition.filter();
    const resp = await api.productionManageApis.getCraftResolveList(temp).catch(() => null);
    this.loading = false;

    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 生产线列表数据 */
  ProductionLineData: TProductionLineListData | null = null

  async init() {
    await nextTick();

    this.getList();
    this.ProductionLineData = await getProductionLineList(); // 获取生产线列表数据 -- 用于筛选等
  }
}
