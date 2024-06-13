import api from '@/api';
import { ITaskExceptionInfo } from '../../js/type';
import { ITaskExceptionHandlingDetail } from './type';

export class ExceptionHandleDetailClass {
  /** 是否为外协异常 */
  IsOutSourcing = false

  /** 当前正在处理的列表条目 */
  rowData: ITaskExceptionInfo | null = null

  /** 异常任务详细信息 */
  handleDetailData: null | ITaskExceptionHandlingDetail = null

  constructor(IsOutSourcing: boolean, rowData: ITaskExceptionInfo | null) {
    this.IsOutSourcing = IsOutSourcing;
    this.rowData = rowData;
  }

  /** 获取异常任务详细信息 */
  async getTaskExceptionDetail() {
    if (!this.rowData) return;

    const resp = await api.ExceptionHandlerApis.getProductionExceptionDealDetail(this.rowData.ID).catch(() => null);

    if (resp?.data?.isSuccess) {
      this.handleDetailData = resp.data.Data;
    }
  }
}
