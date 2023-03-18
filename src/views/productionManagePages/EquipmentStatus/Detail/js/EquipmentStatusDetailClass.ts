import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { ILocalEquipmentStatusItem } from '../../List/js/types';
import { Condition } from './Condition';

/**
 * 类 - 任务详情列表
 *
 * @export
 * @class EquipmentTaskDetailClass
 */
export class EquipmentTaskDetailClass {
  condition: Condition

  /** 任务列表 */
  TaskList: ITaskDetail[] = []

  TaskListNumber = 0

  loading = false

  /** 当前设备信息 */
  rowData: ILocalEquipmentStatusItem | null

  constructor(row: ILocalEquipmentStatusItem | null) {
    this.rowData = row;
    this.condition = new Condition(row?.Equipment);
  }

  /** 获取当前设备上的任务信息 */
  public async getTaskList(Page = 1) {
    if (!this.rowData) return;

    this.TaskList = [];
    this.loading = true;

    this.condition.Page = Page;

    const resp = await api.productionManageApis.getEquipmentTaskList(this.condition).catch(() => null);
    this.loading = false;

    if (resp?.data.isSuccess) {
      this.TaskList = resp.data.Data || [];
      this.TaskListNumber = resp.data.DataNumber;
    }
  }

  /** 更换任务设备 */
  public async switchEquSubmit(TaskWorkingID: string, EquipmentID: string, callback: () => void) {
    // 设置成功后从列表中删除掉该项，并且总条码数 - 1
    const resp = await api.productionManageApis.getTaskChangeEquipment(TaskWorkingID, EquipmentID).catch(() => null);

    if (resp?.data.isSuccess) {
      const cb = () => {
        this.TaskListNumber -= 1;
        this.TaskList = this.TaskList.filter(it => it.Working.TaskWorkingID !== TaskWorkingID);
        callback();
      };

      MpMessage.dialogSuccess('更换成功', cb, cb);
    }
  }
}
