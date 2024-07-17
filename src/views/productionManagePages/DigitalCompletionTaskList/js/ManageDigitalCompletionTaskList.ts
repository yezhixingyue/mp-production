import api from '@/api';
import { Condition } from './Condition';
import { IDigitalTask } from './type';

/** 数码完工任务管理类 */
export class ManageDigitalCompletionTaskList {
  IsPlateTask: boolean

  condition: Condition

  list: IDigitalTask[] = []

  listNumber = 0

  loading = false

  constructor(IsPlateTask: boolean) {
    this.IsPlateTask = IsPlateTask;
    this.condition = new Condition(IsPlateTask);

    this.getList();
  }

  /** 清除条件筛选项 */
  clearCondition() {
    this.condition = new Condition(this.IsPlateTask);
  }

  async getList(Page = 1) {
    this.list = [];
    this.loading = true;

    this.condition.Page = Page;

    const temp = this.condition.filter();
    const resp = await api.productionManageApis.getDigitalTaskList(temp).catch(() => null);

    this.loading = false;

    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }
}
