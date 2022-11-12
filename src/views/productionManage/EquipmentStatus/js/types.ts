import { EquipmentStatusEnum, EquipmentTaskStatusEnum } from './enums';

/**
 * 设备状态条目接口 - 暂定
 *
 * @export
 * @interface IEquipmentStatusItem
 */
export interface IEquipmentStatusItem {
  ID: string
  /** 设备名称 */
  Name: string
  /** 设备分类名称 */
  ClassName: string
  /** 设备组名称 */
  GroupName: string
  /** 设备状态 */
  Status: EquipmentStatusEnum
  /** 设备操作人 */
  Operater: {
    ID: string
    Name: string
  }
  /** 错误信息 */
  Error: string
  /** 任务数量 */
  TaskNumber: number
  /** 任务列表 */
  TaskList: []
}

/**
 * 任务接口 - 暂定
 *
 * @export
 * @interface ITask
 */
export interface ITask {
  ID: number
  /** 任务目标产品 */
  ProductName: string
  /** 数量 */
  // ProductionCount: number
  /** 单位 */
  // Unit: string
  /** 任务状态 */
  Status: EquipmentTaskStatusEnum
  /** 开始时间 */
  BeginTime: string
  /** 结束时间 */
  EndTime: string
  /** 任务时长 */
  Duration: number
}
