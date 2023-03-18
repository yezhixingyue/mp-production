import { EquipmentFilterClass } from '@/assets/js/Class/EquipmentFilterClass';
import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { Condition } from './Condition';

/**
 * 生产任务列表管理类
 *
 * @export
 * @class ManageTaskListClass
 */
export class ManageTaskListClass {
  condition = new Condition()

  TaskList: ITaskDetail[] = []

  TaskListNumber = 0

  loading = false

  /** 用于向头部设备筛选提供数据支持 */
  EquipmentFilterData: Required<EquipmentFilterClass> = new EquipmentFilterClass(3)
}
