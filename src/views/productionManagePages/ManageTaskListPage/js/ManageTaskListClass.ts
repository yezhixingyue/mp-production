import api from '@/api';
import { EquipmentFilterClass } from '@/assets/js/Class/EquipmentFilterClass';
import { Condition } from './Condition';
import { IManageTaskListItem } from './type';

/**
 * 生产任务列表管理类
 *
 * @export
 * @class ManageTaskListClass
 */
export class ManageTaskListClass {
  condition = new Condition()

  list: IManageTaskListItem[] = []

  listNumber = 0

  loading = false

  /** 获取生产任务列表数据 */
  getList = async (Page = 1) => {
    this.condition.Page = Page;

    this.list = [];

    this.loading = true;

    const temp = this.condition.filter();
    const resp = await api.productionManageApis.getTaskList(temp).catch(() => null);

    this.loading = false;

    if (resp?.data.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 用于向头部设备筛选提供数据支持 */
  EquipmentFilterData: Required<EquipmentFilterClass> = new EquipmentFilterClass(3)
}
