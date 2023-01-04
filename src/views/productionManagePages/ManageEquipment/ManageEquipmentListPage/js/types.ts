import { ShiftTypeEnum } from '@/views/productionSetting/deliveryTimeManage/enums';
import { EquipmentStatusEnum } from './enum';

export interface IKeyValuePair {
  Key: number
  Value: number
}

export interface IEquipmentMaintainInfo {
  /** 设备ID */
  ID: string
  /** 自动开关机 */
  IsAutomatic: boolean
  /** 限制时段是否为关机  */
  LimitOff: boolean
  /** 周期类型： 0 1 2  每天 每周 每月 */
  PeriodType: ShiftTypeEnum
  /** 周期条目列表 */
  ItemList: number[]
  /** 周期时段列表(Key开始时段 Value结束时段 单位分钟) */
  PeriodList: IKeyValuePair[]
}

export interface IManageEquipmentInfo {
  ID: string
  Name: string
  /** 分类ID */
  ClassID: number | ''
  /** 设备组ID  */
  GroupID: string | ''
  /** 设备组名称  */
  GroupName?: string | ''
  /** 显示顺序 */
  Index: number
  /** 是否启用 */
  IsUseable: boolean
  /** 设备状态 */
  Status: EquipmentStatusEnum
  /** 是否开启 */
  IsOpen: boolean
  /** 绑定的终端编号，如果有值则说明已绑定 */
  Terminal: string
  /** 维护信息 */
  MaintainInfo: IEquipmentMaintainInfo
  /** 备注 */
  Remark: string
  /** 创建时间 */
  CreateTime: string
}

/** 经过处理的 用于表格展示的列表数据类型 */
export interface IManageEquipmentTableListItem extends IManageEquipmentInfo {
  _ClassName: string,
  _GroupName: string,
}
