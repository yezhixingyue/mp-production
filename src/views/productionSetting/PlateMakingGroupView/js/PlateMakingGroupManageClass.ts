import api from '@/api';
import { ProcessListType } from '@/store/modules/productionSetting/types';
import { FetchWorkingProcedureSearchEnum } from '../../js/enums';
import { PlateMakingGroupManageListClass } from './PlateMakingGroupManageListClass';

export class PlateMakingGroupManageClass {
  /** 制版工序列表数据 （ 顶部tab ） */
  WorkingList: ProcessListType[] = []

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
    this.loading = true;
    const resp = await api.getWorkingProcedureSearch(FetchWorkingProcedureSearchEnum.PlateMaking).catch(() => null);
    this.loading = false;

    if (resp?.data.isSuccess) {
      this.WorkingList = resp.data.Data as ProcessListType[];
      if (this.WorkingList.length > 0) {
        this.WorkID = this.WorkingList[0].ID;
      }
    }
  }
}
