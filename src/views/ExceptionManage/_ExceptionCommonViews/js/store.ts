import { ITaskExceptionInfo } from './type';

/** 管理页面切换时数据的存放和共享 */
class HandleExceptionRowDataStore {
  prodExceptionData: null | ITaskExceptionInfo = null

  outSExceptionData: null | ITaskExceptionInfo = null

  setData(row: ITaskExceptionInfo | null, IsOutSourcing: boolean) {
    if (IsOutSourcing) {
      this.outSExceptionData = row;
    } else {
      this.prodExceptionData = row;
    }
  }

  getData(IsOutSourcing: boolean) {
    return IsOutSourcing ? this.outSExceptionData : this.prodExceptionData;
  }
}

/** 管理页面切换时数据的存放和共享 */
export const handleExceptionRowDataStore = new HandleExceptionRowDataStore();
