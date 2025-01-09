import { OrderStatus } from './enum';

/**
 * 订单管理列表 - 实例列表 - 生产线列表
 *
 * @export
 * @interface ISellOrderLineItem
 */
export interface ISellOrderLineItem {
  /** 生产线ID */
  ID: string
  /** 生产线名称 */
  Name: string
  /** 大版列表 */
  PlateList: number[]
}

/**
 * 订单管理列表 - 实例列表
 *
 * @export
 * @interface ISellOrderInstanceItem
 */
export interface ISellOrderInstanceItem {
  /** 半成品名称 */
  SemiFinishedName: string
  /** 物料 */
  Material: string
  /** 尺寸 */
  Size: string
  /** 数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 生产线列表 */
  LineList: ISellOrderLineItem[]
  /** 印刷版拼版详情与进度 */
  PrintFileRemark: string | null
  /** 后工版拼版详情与进度 */
  AfterPrintFileRemark: string | null
}

/**
 * 订单管理列表
 *
 * @export
 * @interface IManageOrderListItem
 */
export interface IManageOrderListItem {
  /** 订单ID */
  ID: string
  /** 销售服务器名称 */
  ServerName: string
  /** 订单编号 */
  OrderCode: string
  /** 分类一级 */
  FirstLevel: string
  /** 分类二级 */
  SecondLevel: string
  /** 产品名称 */
  ProductName: string
  /** 内容 */
  Content: string
  /** 款数 */
  KindCount: number
  /** 数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 尺寸 */
  Size: string
  /** 订单状态 */
  Status: OrderStatus
  /** 下单时间 */
  CreateTime: string
  /** 预计完成时间 */
  WishFinishTime: string
  /** 完成时间 */
  FinishTime: string
  /** 是否手动下单 */
  IsManualOrder: boolean
  /** 是否可替换文件 */
  IsReplaceable: boolean
  /** 是否已置顶 */
  IsTop: boolean
  /** 是否可转自定义版 */
  ToCustomPlate: boolean
  /** 生产线 */
  Line: string
  /** 实例列表 */
  InstanceList: ISellOrderInstanceItem[]
  AfterPrintFileRemark: string
  /** 下载文件列表 */
  CheckedFileList: { FilePath: string; ID: string; Name: string; IsReplaceable: boolean }[]
}

/** 时间线数据类型 */
export interface IOrderTimelineItem {
  /**  */
  Index: number
  ShowFocus: boolean
  Operator: string
  Description: string
  OperateTime: string
  SystemFill: boolean
  _IsBegin?: boolean
}

export interface IOrderCancelRelation {
  ID: string
  PlateList: {
    ID: string
    Code: string
    /** 取消整个大版 */
    IsWholePlate: boolean | ''
  }[]
}
