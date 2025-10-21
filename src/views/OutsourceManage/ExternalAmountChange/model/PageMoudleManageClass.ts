import api from '@/api';
import { RemovePrivateProperties } from '@/types/types';
import { ISubcontractorFactoryListItemType } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorFactory';
import { ManageListClass } from './ManageListClass';
import { OutsourceManager } from './OutsourceManager';

/** 外协金额修改模块管理类 */
export class PageMoudleManageClass {
  /** 列表相关 */
  listManager = new ManageListClass()

  /** 外协主管设置相关 */
  outsourceManager = new OutsourceManager();

  /** 全部员工列表 */
  StaffList: { StaffID: string; StaffName: string }[] = []

  /** 财务审核人列表 */
  RecheckerList: { ID: string; Name: string }[] = []

  /** 外协工厂列表 */
  FactoryList: Pick<ISubcontractorFactoryListItemType, 'ID' | 'Name' | 'Mobile'>[] = [{ ID: '', Name: '不限', Mobile: '' }]

  private async _getStaffList() {
    const resp = await api.getStaffSelect();

    if (resp?.data?.isSuccess) {
      this.StaffList = resp.data.Data || [];
    }
  }

  private async _getRecheckerList() {
    const resp = await api.outsourceApis.getExternalFactoryGetRecheckerList();
    if (resp?.data?.isSuccess) {
      this.RecheckerList = resp.data.Data || [];
    }
  }

  private async _getSubcontractorFactoryList() { // 获取外协工厂列表数据 用于列表筛选
    const resp = await api.getSubcontractorFactoryList({ Page: 1, PageSize: 9999 }).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.FactoryList.push(...resp.data.Data);
    }
  }

  init() {
    this.listManager.getList();
    this.outsourceManager.getList();

    this._getStaffList();
    this._getRecheckerList();
    this._getSubcontractorFactoryList();
  }
}

export type PageMoudleManageClassType = RemovePrivateProperties<PageMoudleManageClass>;
