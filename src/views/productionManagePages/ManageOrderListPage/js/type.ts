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
  /** 下单时间 */
  CreateTime: string
  /** 预计完成时间 */
  WishFinishTime: string
  /** 是否已置顶 */
  IsTop: boolean
  /** 生产线 */
  Line: string
  /** 实例列表 */
  InstanceList: ISellOrderInstanceItem[]
}
