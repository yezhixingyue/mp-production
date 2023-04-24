import clientApi from '@/api/client';
import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { ITaskDetail } from '../../types';
import { Condition } from './Condition';

/**
 * 类 - 获取未完成的任务列表
 *
 * @export
 * @class InstanceTaskListClass
 */
export class InstanceTaskListClass {
  condition: Condition

  /** 任务列表 */
  TaskList: ITaskDetail[] = []

  TaskListNumber = 0

  loading = false

  Equipment: IManageEquipmentInfo

  constructor(Equipment: IManageEquipmentInfo, isUndelevered = false) {
    this.Equipment = Equipment;
    this.condition = new Condition(Equipment, isUndelevered);
  }

  /** 获取时机： 1. 加载当前任务完成后 2. 扫描条码完成后 - 根据结果获取 */
  public async getEquipmentTaskList(Page = 1, Equipment: IManageEquipmentInfo | null = null) {
    this.TaskList = [];
    this.loading = true;

    this.condition.Page = Page;

    if (Equipment) {
      this.condition.setEquipment(Equipment);
    }

    const resp = await clientApi.getEquipmentTaskList(this.condition.getParams()).catch(() => null);
    this.loading = false;

    if (resp?.data.isSuccess) {
      this.TaskList = resp.data.Data || [];
      this.TaskListNumber = resp.data.DataNumber;
    }
  }
}
