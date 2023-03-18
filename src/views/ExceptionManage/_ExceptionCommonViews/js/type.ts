import { ProductiveTaskStatusEnum } from '@/views/ProductionClient/assets/js/enum';
import {
  IEquipmentBaseInfo, ITaskChunkInfo, ITaskOrderInfo, ITaskPlateInfo, INextWorkingProduction, IWorkingExternalAttribute,
} from '@/views/ProductionClient/assets/js/types';
import { ChunkStatusEnum } from '@/views/productionManagePages/ManageChunkListPage/js/enum';
import { IConvertAssistInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { ExceptionHandlerStatusEnum } from './enum';

/**
 * 异常列表条目信息
 *
 * @export
 * @interface ITaskExceptionInfo
 */
export interface ITaskExceptionInfo {
  /** 异常ID */
  ID: string
  /** 任务编号 */
  TaskCode: number
  /** 工序 */
  Working: string
  /** 异常处理状态 */
  Status: ExceptionHandlerStatusEnum
  /** 对象类型 （报工类型?） */
  TargetType: ReportModeEnum
  /** 目标编号 */
  TargetCode: string
  /** 任务详情 */
  TaskDetail: string
  /** 加工数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 设备信息 */
  Equipment: IEquipmentBaseInfo
  /** 情况说明 */
  Remark: string
  /** 提交人 */
  SubmitterName: string
  /** 创建时间（提交时间） */
  CreateTime: string
  /** 处理人 */
  HandlerName: string
  /** 处理时间 */
  HandlerTime: string
}

/** 辅助信息 */
interface ITaskWorkingAssistInfo extends Omit<IConvertAssistInfo, 'Value' | '_Name'> {
  /** 任务工序ID */
  TaskWorkingID: string
  Name: string
}

/** 异常任务工序大版信息 */
export interface IExceptionTaskPlateInfo extends Omit<ITaskPlateInfo, 'WorkingList'> {
  Revocationable: boolean
}

/** 异常任务工序订单信息 */
export interface IExceptionTaskOrderInfo extends ITaskOrderInfo {
  /** 订单数量 */
  OrderNumber: number
  /** 块数量 */
  ChunkNumber: number
  /** 生产线名称 */
  Line: string
}

/** 工序信息 - 不完整 */
export interface IExceptionTaskWorkingInfo {
  /** 任务工序ID */
  TaskWorkingID: string
  /** 生产线ID */
  LineID: string
  /** 工序ID */
  WorkingID: string
  /** 名称 */
  WorkingName: string
  /** 报工方式 */
  ReportMode: ReportModeEnum
  /** 加工数量 */
  Number: number
  /** 外协信息 */
  ExternalAttribute: IWorkingExternalAttribute
  /** 辅助信息列表 */
  AssistList: ITaskWorkingAssistInfo[]
  /** 订单信息 */
  OrderInfo?: IExceptionTaskOrderInfo
  /** 大版信息 */
  PlateInfo: IExceptionTaskPlateInfo
  /** 块信息 */
  ChunkInfo: ITaskChunkInfo
}

export interface IExceptionTaskDetail {
  /** 任务ID */
  ID: string
  /** 任务编号 */
  Code: number
  /** 任务状态 */
  Status: ProductiveTaskStatusEnum
  /** 加工总数量 */
  TotalNumber: number
  /** 当前为第几次加工 */
  Index: number
  /** 未完成数量 */
  UnFinishNumber: number
  /** 工序信息 */
  Working: IExceptionTaskWorkingInfo
  /** 设备信息 */
  Equipment: IEquipmentBaseInfo
  /** 下一道工序列表  */
  NextWorkingList: INextWorkingProduction[]
  /** 最迟完工时间，预计完成时间 */
  LatestFinishTime: string
  /** 最晚送达时间 */
  LatestSendTime: string
  /** 开始时间 - 如果是外协 则是外协时间 */
  StartTime: string
  /** 创建时间 */
  CreateTime: string
  /** 操作人 - 外协人 */
  Operator: string
}

/** 可设置异常工序列表 */
export interface IExceptionWorking {
  ID: string
  Name: string
  /** 组合块ID  */
  UnionChunkID: string
  /** 是否需要领料 */
  ReceiveMaterial: boolean
  /** 是否需要重新制版 */
  PlateMaking: boolean
}

/** 异常任务组合生产线信息 */
export interface IExceptionUnionLine {
  ID: string
  Name: string
  /** 可勾选工序列表 */
  WorkingList: IExceptionWorking[]
}

export interface IExceptionChunk {
  ID: string
  Name: string
  Code: string
  Number: number
  Unit: string
  Size: string
  Status: ChunkStatusEnum
  /** 可勾选工序列表 */
  WorkingList: IExceptionWorking[]
}

/** 大版重新生产处理字段类型 */
export interface IRedoReproduce {
  /** 重新领料 */
  ReceiveMaterial: boolean
  /** 重新拼版 */
  Platemaking: boolean
}

/** 异常任务大版列表信息 */
export interface IExceptionPlate extends ITaskPlateInfo {
  /** 重做信息 */
  Reproduce: IRedoReproduce
  /** 可勾选工序列表 */
  WorkingList: IExceptionWorking[]
  /** 块 */
  ChunkList?: IExceptionChunk[]
  /** 大版是否可重新生产 */
  Redoable: boolean
  /** 大版是否可撤回拼版前 */
  Revocationable: boolean
  ChildList: null | IExceptionPlate[]
}

/**
 * 处理任务异常调用的详情接口
 *
 * @export
 * @interface ITaskExceptionDetail
 */
export interface ITaskExceptionDetail {
  /** 异常ID */
  ID: string
  /** 处理状态 */
  Status: ExceptionHandlerStatusEnum
  /** 任务详情 */
  TaskDetail: IExceptionTaskDetail
  /** 组合生产线信息 */
  UnionLine: IExceptionUnionLine
  /** 大版列表 */
  PlateList: IExceptionPlate[]
  /** 情况说明 */
  Remark: string
  /** 提交人 */
  SubmitterName: string
  /** 创建时间 */
  CreateTime: string
}
