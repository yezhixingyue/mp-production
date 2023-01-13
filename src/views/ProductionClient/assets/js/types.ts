import { IBaseProperty, IConvertAssistInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { MaterialSourceTypeEnum } from '@/views/productionSetting/js/enums';
import { ReportModeEnum, WorkingTypeEnum } from '@/views/productionSetting/process/enums';
import { EquipmentReceiveCodeEnum, ProductiveTaskStatusEnum } from './enum';

/**
 * 设置关联机器绑定数据列表类型
 *
 * @export
 * @interface IEquipmentSetupItem
 */
export interface IEquipmentSetupItem {
  ClassID: number | ''
  GroupID: string
  ID: string
  _key: string
}

/** 任务中工序上所需要的物料列表类型 */
export interface IWorkingMaterialSource {
  /** 物料 */
  Material: IBaseProperty<string>
  /** 是否外协工厂自备（针对外协工厂） */
  FactoryPrivide: boolean
  /** 物料来源类型 */
  SourceType: MaterialSourceTypeEnum
  /** 来源ID */
  SourceID: string
}

/** 任务中工序上的订单信息类型 */
export interface IEquipmentOrderInfo {
  /** 订单ID */
  ID: string
  /** 销售端名称 */
  ServerName: string
  /** 订单编号 */
  OrderID: string
  /** 订单内容 */
  Content: string
  /** 产品一级分类 */
  FirstLevel?: string
  /** 产品二级分类 */
  SecondLevel?: string
  /** 产品信息 */
  Product?: string
  /** 产品单位 -- 大版报工方式时固定为张 */
  Unit: string
  /** 尺寸 */
  Size: string
  /** 工序列表 */
  WorkingList:IBaseProperty<string>[]
}

/** 任务中工序上的大版信息类型 */
export interface IEquipmentPlateInfo {
  /** 大版ID */
  ID: string
  /** 大版编号 */
  Code: number
  /** 拼版模板名称 */
  Template: string
  /** 拼版模板尺寸名称 */
  TemplateSize: string
  /** 物料 */
  Material: string
  /** 单位 */
  Unit: string
  /** 工序列表 */
  WorkingList:IBaseProperty<string>[]
}

/** 任务中工序上的块信息类型 */
export interface IEquipmentChunkInfo {
  /** 块名称 */
  Name: string
  /** 单位 */
  Unit: string
  /** 尺寸 */
  Size: string
  /** 工序列表 */
  WorkingList:IBaseProperty<string>[]
}

/** 加工任务中 - 当前任务工序信息 */
export interface IEquipmentWorkingInfo {
  /** 任务工序ID */
  ID: string
  /** 工序ID */
  WorkingID: string
  /** 工序名称 */
  WorkingName: string
  /** 对象列表 - 暂未使用 */
  TargetID: string
  /** 工序类型 */
  Type: WorkingTypeEnum
  /** 报工方式 */
  ReportMode: ReportModeEnum
  /** 是否允许部分报工 */
  AllowPartReport: boolean
  /** 部分报工最小数量 */
  MinPartReportNumber: number
  /** 是否允许批量报工 */
  AllowBatchReport: boolean
  /** 损耗 */
  Wastage: number
  /** 准备时间 */
  PrepareDuration: number
  /**  生产时间  */
  ProductionDuration: number
  /** 干燥时间 */
  DryDuration: number
  /** 加工次数  */
  WorkTimes: number
  /** 工序在生产线中的排序  */
  Index: number
  /** 物料列表 */
  MaterialList: IWorkingMaterialSource[]
  /** 辅助信息列表 */
  AssistList: IConvertAssistInfo[]
  /** 订单信息 */
  OrderInfo?: IEquipmentOrderInfo
  /** 大版信息 */
  PlateInfo?: IEquipmentPlateInfo
  /** 块信息 */
  ChunkInfo?: IEquipmentChunkInfo,
}

/** 当前任务设备基础信息 */
export interface IEquipmentBaseInfo {
  /** 设备ID */
  ID: string
  /** 设备名称 */
  Name: string
  /** 设备组ID */
  GroupID: string
  /** 设备组名称 */
  GroupName: string
  /** 是否外协工厂 */
  IsOutSourcing: boolean
}

/** 当前任务的下一个工序信息列表类型 */
export interface INextWorkingProduction {
  /** ID */
  ID: string
  /** 名称 */
  Name: string
  /** 加工设备 */
  Equipment: IEquipmentBaseInfo
  /** 颜色 */
  Color: string
}

/**
 * 当前加工任务信息类型
 *
 * @export
 * @interface IEquipmentTaskInfo
 */
export interface IEquipmentTaskInfo {
  /** 任务ID */
  ID: string
  /** 任务编号 */
  Code: number
  /** 任务状态 */
  Status: ProductiveTaskStatusEnum
  /** 加工总数量 */
  TotalNumber: number
  /** 未完成数量 -- 通常在可部分报工情况下会使用到 */
  UnFinishNumber: number
  /** 此工序加工第几次 */
  Index: number
  /** 工序信息 */
  Working: IEquipmentWorkingInfo,
  /** 设备信息 */
  Equipment: IEquipmentBaseInfo,
  /** 下一道工序列表  */
  NextWorkingList: INextWorkingProduction[]
  /** 创建时间 */
  CreateTime: string
  /** 开始时间 */
  StartTime: string
  /** 最迟完成时间 */
  LatestFinishTime: string
}

/**
 * 扫码完成后返回的结果类型
 *
 * @export
 * @interface IReceiveResult
 */
export interface IReceiveResult {
  /** 响应码 */
  Code: EquipmentReceiveCodeEnum
  /** 返回信息 -- 目前可能显示的内容：无需生产 | 裁切机-3号机 */
  Message: string
  /** 任务编号 */
  TaskCode: number
  /** 目标编号 */
  TargetCode: string
  /** 物料信息 */
  Material: string
  /** 尺寸 */
  Size: string
  /** 数量 */
  Number: number
  /** 单位 */
  Unit: string
}

/**
 * 设备报停错误信息
 *
 * @export
 * @interface IEquipmentErrorInfo
 */
export interface IEquipmentErrorInfo {
  /** 报停原因 */
  ErrorTips: string
  /** 是否有替换设备 */
  HaveReplaceEquipment: boolean
  /** 无替换设备时的情况说明 */
  Remark: string
  /** 新设备信息 （如果有替换设备） */
  Equipment: IEquipmentBaseInfo
  /** 待转移任务列表 */
  TaskList: IEquipmentTaskInfo[]
}
