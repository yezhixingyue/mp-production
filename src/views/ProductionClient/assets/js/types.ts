import { IRedoReproduce } from '@/views/ExceptionManage/_ExceptionCommonViews/js/type';
import { TargetTypeEnum } from '@/views/ExceptionManage/_ExceptionCommonViews/SetupView/js/enum';
import { ExternalTaskStatusEnum } from '@/views/OutsourceManage/js/enum';
import { PlateStatusEnum } from '@/views/productionManagePages/ManagePlateListPage/js/enum';
import { IBaseProperty, IConvertAssistInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
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
  // FactoryPrivide: boolean
  // /** 物料来源类型 */
  // SourceType: MaterialSourceTypeEnum
  // /** 来源ID */
  // SourceID: string
}

/** 任务中工序上的订单信息类型 */
export interface ITaskOrderInfo {
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
  /** 数量 */
  Number: number
  /** 产品单位 -- 大版报工方式时固定为张 */
  Unit: string
  /** 尺寸 */
  Size: string
  /** 预计生产完成时间 */
  ProduceEndTime: string
  /** 工序列表 */
  WorkingList:IBaseProperty<string>[]
}

/** 任务中工序上的大版信息类型 */
export interface ITaskPlateInfo {
  /** 大版ID */
  ID: string
  /** 大版编号 */
  Code: number
  /** 生产线 */
  Line: string
  /** 拼版模板名称 */
  Template: string
  /** 拼版模板尺寸名称 */
  TemplateSize: string
  /** 物料 */
  Material: string
  /** 加工数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 订单数量 */
  OrderNumber: number
  /** 块数量 */
  ChunkNumber: number
  /** 大版状态 = ['0', '10', '30', '40', '255'], 枚举值未定义  */
  Status: PlateStatusEnum
  /** 工序列表 */
  WorkingList:IBaseProperty<string>[]
  ChildList: null | ITaskPlateInfo[]
  Revocationable: boolean
  /** 重做信息 */
  Reproduce: IRedoReproduce
  /** 大版是否可重新生产 */
  Redoable: boolean
  MapFilePath: string
  Index: string
}

/** 任务中工序上的块信息类型 */
export interface ITaskChunkInfo {
  ID: string
  /** 编号 */
  Code: string
  /** 块名称 */
  Name: string
  /** 数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 尺寸 */
  Size: string
  /** 工序列表 */
  WorkingList:IBaseProperty<string>[]
}

/** 当前任务设备基础信息 */
export interface IEquipmentBaseInfo {
  /** 设备ID */
  ID: string
  /** 设备名称 */
  Name: string
  /** 设备组分类ID */
  ClassID: number
  /** 设备组分类名称 */
  ClassName: string
  /** 设备组ID */
  GroupID: string
  /** 设备组名称 */
  GroupName: string
  /** 是否外协工厂 */
  IsExternalFactory: boolean
}

/** 工序中的辅助信息类型 */
// export interface ITaskWorkingAssistInfo extends Omit<IConvertAssistInfo, '_Name' | 'Value'> {
//   /** 任务工序ID */
//   TaskWorkingID: string
// }

/** 工序外协信息 */
export interface IWorkingExternalAttribute {
  /** 原价 */
  OrignalAmount: number
  /** 异常减款 */
  ReduceAmount: number
  /** 最终价格 */
  FinalAmount: number
  /** 外协状态 */
  Status: ExternalTaskStatusEnum
  /** 是否有文件可下载 */
  HaveFile: boolean
  /** 外协修改的文字内容 */
  ProcessContent: string
}

/** 加工任务中 - 当前任务工序信息 */
export interface ITaskWorkingInfo {
  /** 任务工序ID */
  TaskWorkingID: string
  /** 生产线ID */
  LineID: string
  /** 工序ID */
  WorkingID: string
  /** 工序名称 */
  WorkingName: string
  /** 对象类型 （报工类型?） */
  TargetType: TargetTypeEnum
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
  /** 加工数量(不含伸放) */
  Number: number
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
  /** 设备信息 */
  Equipment?: IEquipmentBaseInfo
  /** 物料列表 */
  // MaterialList: IWorkingMaterialSource[]
  /** 辅助信息列表 */
  AssistList: IConvertAssistInfo[]
  /** 订单信息 */
  OrderInfo?: ITaskOrderInfo
  /** 大版信息 */
  PlateInfo?: ITaskPlateInfo
  /** 块信息 */
  ChunkInfo?: ITaskChunkInfo,
  /** 可用设备列表 */
  UseableEquipmentList: IBaseProperty<string>[]
  /** 外协属性 */
  ExternalAttribute: IWorkingExternalAttribute
}

/** 当前任务的下一个工序信息列表类型 */
export interface INextWorkingProduction {
  /** 加工设备 */
  Equipment: IEquipmentBaseInfo
  /** 颜色 */
  Color: string
  /** 任务工序ID */
  TaskWorkingID: string
  /** 任务流程类型 -- 具体枚举值不清楚 - 似乎暂未用到该值 */
  Type: number
  /** 下一个任务工序ID */
  NextTaskWorkingID: string
  /**  对象ID */
  TargetID: string
  /** ID */
  ID: string
  /** 名称 */
  Name: string
}

/**
 * 当前加工任务信息类型
 *
 * @export
 * @interface ITaskDetail
 */
export interface ITaskDetail {
  /** 任务ID */
  ID: string
  /** 任务编号 */
  Code: number
  /** 任务状态 */
  Status: ProductiveTaskStatusEnum
  /** 加工总数量 */
  Number: number
  /** 此工序加工第几次 */
  Index: number
  /** 未完成数量 -- 通常在可部分报工情况下会使用到 */
  UnFinishNumber: number
  /** 工序信息 */
  Working: ITaskWorkingInfo,
  /** 设备信息 */
  Equipment: IEquipmentBaseInfo,
  /** 下一道工序列表  */
  NextWorkingList: INextWorkingProduction[]
  /** 开始时间 */
  StartTime: string
  /** 预计加工时长（分钟） */
  WishDuration: number
  /** 最晚送达时间 */
  LatestSendTime: string
  /** 最迟完工时间 */
  LatestFinishTime: string
  /** 实际加工时长（分钟） */
  ActualDuration: number
  /** 完工时间 */
  FinishTime: string
  /** 是否已置顶 */
  IsTop: boolean
  /** 操作人 */
  Operator: string
  /** 创建时间 */
  CreateTime: string
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
  TaskList: ITaskDetail[]
}
