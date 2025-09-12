import api from '@/api';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { RemovePrivateProperties } from '@/types/types';
import { IUnionTaskTrackInfo } from '../types/type';
import { Condition } from './Condition';
import { IBaseProperty } from '../../ManualOrderHandlerPage/js/types';

/** 组合工单打印列表管理类 */
export class ManageCombineTaskPrintListModel {
  condition = new Condition()

  list: IUnionTaskTrackInfo[] = []

  listNumber = 0

  loading = false

  clearCondition() {
    this.condition = new Condition();
  }

  async getList(Page = 1) {
    this.list = [];
    this.loading = true;

    this.condition.Page = Page;

    const temp = this.condition.filter();
    const resp = await api.productionManageApis.getTaskUnionWorkingList(temp);

    this.loading = false;

    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 组合生产线列表 -- 用户顶部筛选 */
  CombineLineList: IBaseProperty<string>[] = []

  /** 获取所有数码生产线列表 - 用于顶部筛选 */
  private async _getDigitalLineList() {
    const resp = await api.getProductionLineList({ Type: LineTypeEnum.combine });
    if (resp?.data?.isSuccess) {
      this.CombineLineList = [
        { ID: '', Name: '所有生产线' },
        ...resp.data.Data,
      ];
    }
  }

  init() {
    this.getList();
    this._getDigitalLineList();
  }
}

export type TManageCombineTaskPrintListModel = RemovePrivateProperties<ManageCombineTaskPrintListModel>;
