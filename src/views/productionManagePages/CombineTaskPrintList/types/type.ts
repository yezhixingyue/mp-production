import { IEquipmentBaseInfo, ITaskOrderInfo } from '@/views/ProductionClient/assets/js/types';
import { UnionTaskResourceStatusEnum } from './enum';

/** 组合工单打印-组合生产线-组合工序-任务列表信息 */
export interface IUnionTaskTrackInfo {
  ID: string
  /** 任务号 */
  Code: number
  /** 设备信息 */
  Equipment: IEquipmentBaseInfo
  /** 工序名称 */
  WorkingName: string
  /** 拼版描述 */
  ImpositionRemark: string
  /** 资源描述 */
  ResourceRemark: string
  /** 任务工期时间 */
  WishFinishTime: string
  /** 是否已跟进 */
  HaveTracked: string
  /** 是否已齐整 */
  HaveReady: string
  /** 齐整人 */
  ReadyOperator: string
  /** 创建时间 */
  CreateTime: string
  /** 任务订单信息 */
  OrderInfo: ITaskOrderInfo
}

/** 组合工单打印详情资源列表项 */
export interface IUnionTaskResource {
  /** ID */
  ID: string
  /** 名称 */
  Name: string
  /** 款序 */
  Kind: string
  /** 帖序 */
  Signature: string
  /** 内容 */
  Content: string
  /** 设备信息 */
  Equipment: IEquipmentBaseInfo
  /** 正面 */
  FrontUri: string
  /** 背面 */
  VersoUri: string
  /** 资源状态 */
  Status: UnionTaskResourceStatusEnum
}

/** 组合工单打印详情 */
export interface IUnionTaskDetail {
  ID: string
  /** 工单号 */
  WorkCode: string
  /** 任务ID */
  Code: number
  /** 生产线名称 */
  LineName: string
  /** 工序名称 */
  WorkingName: string
  /** 设备信息 */
  Equipment: IEquipmentBaseInfo
  /** 工单有变化 */
  HaveChange: boolean
  /** 齐整人 */
  ReadyOperator: string
  /** 任务工期 */
  WishFinishTime: string
  /** 订单信息  */
  OrderInfo: ITaskOrderInfo
  /** 资源列表 */
  List: IUnionTaskResource[]
}
