import { EquipmentStatusEnumList, EquipmentTaskStatusEnumList } from './EnumList';
import { EquipmentStatusEnum, EquipmentTaskStatusEnum } from './enums';

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
  /** 报错人 */
  ErrorOperater: string
  /** 任务数量 */
  TaskNumber: number
  /** 任务列表 */
  TaskList: ITask[]
}

interface ILocalTask extends ITask {
  _points?: {
    x: number,
    y: number,
    len: number,
  }
  _EquipmentTaskStatusEnumitem?: typeof EquipmentTaskStatusEnumList[number],
}

/**
 * 附加坐标信息的设备状态列表数据类型
 *
 * @export
 * @interface ILocalEquipmentStatusItem
 * @extends {IEquipmentStatusItem}
 */
export interface ILocalEquipmentStatusItem extends IEquipmentStatusItem {
  _menuBorder: {
    x: number
    y: number
    w: number
    h: number
  }
  TaskList: ILocalTask[]
}

export interface IPopupDataItemData extends ILocalEquipmentStatusItem {
  _EquipmentStatusEnumItem?: typeof EquipmentStatusEnumList[number],
}

interface IPopupData {
  item: null | IPopupDataItemData,
  Task: null | ILocalTask
}

/** 设备状态列表中悬浮时展示的信息类型 */
export interface IHoverTarget {
  position: {
    offsetX: number,
    offsetY: number,
    clientX: number,
    clientY: number,
  }
  index: number,
  data: IPopupData,
}
