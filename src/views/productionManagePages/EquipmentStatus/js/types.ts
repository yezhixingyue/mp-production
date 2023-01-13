import { IEquipmentBaseInfo } from '@/views/ProductionClient/assets/js/types';
import { EquipmentStatusEnumList, EquipmentTaskStatusEnumList } from './EnumList';
import { EquipmentStatusForBoardEnum, EquipmentTaskStatusEnum } from './enums';

/**
 * 任务接口
 *
 * @export
 * @interface ITask
 */
export interface ITask {
  /** 任务编号 */
  Code: number
  /** 物料 */
  Material: string
  /** 数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 任务状态 */
  Status: EquipmentTaskStatusEnum
  /** 开始时间 */
  StartTime: string
  /** 结束时间 */
  EndTime: string
  /** 任务时长 -- 单位是小时吗？ */
  Duration: number
}

/**
 * 设备状态条目接口
 *
 * @export
 * @interface IEquipmentStatusItem
 */
export interface IEquipmentStatusItem {
  /** 设备分类名称 */
  ClassName: string
  /** 设备信息 */
  Equipment: IEquipmentBaseInfo,
  /** 设备状态 */
  Status: EquipmentStatusForBoardEnum
  /** 设备操作人 */
  Operator: string
  /** 错误信息 */
  Remark: string
  /** 报错人 */
  ErrorOperator: string
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
