import api from '@/api';
import { ConditionForList } from './ConditionForList';
import { ITaskExceptionInfo } from './type';

export class ManageListClass {
  /** 是否外协异常 */
  IsOutSourcing: boolean

  /** 条件 */
  condition: null | ConditionForList = null

  list: ITaskExceptionInfo[] = []

  listNumber = 0

  loading = false

  constructor(IsOutSourcing: boolean) { // 初始化
    this.IsOutSourcing = IsOutSourcing;
    this.condition = new ConditionForList(IsOutSourcing);
  }

  /** 清空条件筛选项 */
  clearCondition() {
    this.condition = new ConditionForList(this.IsOutSourcing);
  }

  /** 获取列表数据 */
  async getList(Page = 1) {
    if (!this.condition) return;

    this.condition.Page = Page;

    this.list = [];

    this.loading = true;

    const temp = this.condition.filter();
    const resp = await api.ExceptionHandlerApis.getProductionExceptionList(temp).catch(() => null);

    this.loading = false;

    if (resp?.data.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }
}
