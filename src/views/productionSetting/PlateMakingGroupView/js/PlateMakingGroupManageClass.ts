import api from '@/api';
import { FetchWorkingProcedureSearchEnum } from '../../js/enums';
import { PlateMakingGroupManageListClass } from './PlateMakingGroupManageListClass';
import { IWorkingProcedureSearch } from './types';

export class PlateMakingGroupManageClass {
  /** 制版工序列表数据 （ 顶部tab ） */
  WorkingList: IWorkingProcedureSearch[] = []

  /** 获取制版工序列表数据的loading状态 （ 顶部tab ） */
  loading = false

  /** 制版组列表相关数据 */
  ManageListData = new PlateMakingGroupManageListClass()

  private _curWorkID = ''

  get WorkID() {
    return this._curWorkID;
  }

  set WorkID(WorkID: string) {
    this._curWorkID = WorkID;
    if (WorkID) {
      this.ManageListData.init(WorkID);
    }
  }

  async getWorkingList() {
    this.WorkingList = [];
    this._curWorkID = '';

    this.loading = true;
    const resp = await api.getWorkingProcedureSearch(FetchWorkingProcedureSearchEnum.PlateMakingGroup).catch(() => null);
    this.loading = false;

    if (resp?.data.isSuccess) {
      this.WorkingList = resp.data.Data;
      if (this.WorkingList.length > 0) {
        this.WorkID = this.WorkingList[0].ID;
      }
    }
  }
}
