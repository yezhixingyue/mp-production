import { IProductionLineSet, IWorkingProcedureInfo } from '@/assets/Types/ProductionLineSet/types';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import {
  OrderStatusEnum, PlaceOrderMaterialSourceEnum, PrintColorEnum, PrintSideEnum, ReceiveTypeEnum,
} from './enums';
import { PlaceOrderClass } from './PlaceOrderClass';
import { PlaceOrderProductionInstance } from './PlaceOrderProductionInstance';
import { IImpositionTemplate, ILineWorkingNoteInfo, IProductionLineDetail } from './ProductionLineDetailTypes';

export interface IBaseProperty<T> {
  ID: T | ''
  Name: string
}

/**
 * 生产实例 - 辅助信息列表
 *
 * @interface IConvertAssistInfo
 */
export interface IConvertAssistInfo {
  /** 辅助信息ID */
  ID: string
  _Name: string
  /** 辅助信息类型 */
  Type: AssistInfoTypeEnum
  /** 文字信息 */
  Content: string
  /** 数值信息 -- 暂用不到 */
  // Value: number
}

/**
 * 印刷印色接口类型
 *
 * @export
 * @interface IPrintColor
 */
export interface IPrintColor {
  ID: string
  Name: string
  /** 是否为专色 */
  IsSpecialColor: boolean
  /** 显示颜色 */
  ShowColor: string
}

/**
 * 生产实例 - 文件列表
 *
 * @interface IConvertOrderFile
 */
export interface IConvertOrderFile {
  /** 文件唯一名 */
  UniqueName: string
  /** 文件路径 */
  // FilePath: string
  /** 适用辅助文件列表 [单个辅助文件id] */
  AssistList?: string[]
  /** 存放辅助文件信息 仅辅助文件有 */
  _NoteInfo?: ILineWorkingNoteInfo
  /** 拼版模版id */
  Plate?: string
  /** 存放拼版模板信息 仅拼版文件有 */
  _PlateTemplate?: IImpositionTemplate
  /** 专色列表 [单个颜色id] */
  SpecialColorList?: string[]
  /** 存放专色信息 仅专色文件有 */
  _SpecialColorInfo?: IPrintColor
  _File: null | File
  /** 生产线信息 */
  _LineInfo: {
    ID: string,
    Name: string,
  }
}

interface IAddressAreaCell {
  RegionalID: number,
  RegionalName?: string
  CityID: number
  CityName?: string
  CountyID: number
  CountyName?: string
}

interface ICustomerAddress {
  /** 收货人 */
  Consignee: string
  /** 手机号 */
  Mobile: string
  /** 配送区域 */
  ExpressArea: IAddressAreaCell
  /** 详细地址 */
  AddressDetail: string
}

/**
 * 生产实例
 *
 * @interface IProductionInstance
 */
export interface IProductionInstance {
  ID: string
  // Name: string
  /** 订单ID */
  OrderID: string
  /** 部件ID */
  // PartID: string
  /** 顺序(转换的时候就需要赋值，不能错) */
  Index: number
  /** 印面 = ['0', '1'] */
  PrintSide: PrintSideEnum
  /** 印色列表 */
  ColorList: PrintColorEnum[]
  /** 数量 */
  Number: number
  /** 数量单位 */
  Unit: string
  /** 长 */
  Length: number
  /** 宽 */
  Width: number
  /** 尺寸 */
  Size: string
  /** 印刷文件总面积，可能用不到 */
  TotalArea: number
  /** 物料来源 = ['0', '1', '2', '3'] */
  MaterialSource: PlaceOrderMaterialSourceEnum
  /** 物料 */
  Material: string
  /** 生产线 */
  LineList: IProductionLineSet[]
  /** 工序 */
  WorkingList: IWorkingProcedureInfo[]
  /** 辅助信息列表 */
  AssistList: IConvertAssistInfo[]
  /** 文件列表 */
  FileList: IConvertOrderFile[]
  /** 允许合拼 */
  AllowUnionMekeup: boolean
  /** 输出半成品 */
  SemiFinished: IBaseProperty<string>
  /** 物料取货地址 */
  Address: ICustomerAddress
}

/**
 * 订单 - 产品属性
 *
 * @interface IProductAttribute
 */
export interface IProductAttribute {
  /** 产品一级分类 */
  FirstLevel: IBaseProperty<number>
  /** 产品二级分类 */
  SecondLevel: IBaseProperty<number>
  /** 产品信息 */
  Product: IBaseProperty<string>
  /** 款数 */
  KindCount: number
  /** 数量 */
  ProductAmount: number
  /** 产品单位 */
  Unit: string
}

/**
 * 下单客户收货地址
 *
 * @interface IDeliveryAddress
 */
export interface IDeliveryAddress {
  Express: {
    First: number
    Second: number
  },
  ExpressText: string
  Address: {
    Consignee: string
    Mobile: string
    AddressDetail: string
  }
}

/**
 * 下单客户信息
 *
 * @interface IPlaceCustomerInfo
 */
export interface IPlaceCustomerInfo {
  /** 客户ID */
  CustomerID : string
  /** 客户编号 */
  CustomerSN : string
  /** 客户名称 */
  CustomerName: string
  /** 客户手机号 */
  Mobile: string
  /** 销售区域 */
  SellArea: IAddressAreaCell
  /** 客户类型 */
  Type: number
  /** 等级 */
  Grade: number
}

/**
 * 下单价格信息
 *
 * @interface IOrderFund
 */
interface IOrderFund {
  /** 成交价(不包含运费) */
  FinalPrice: number
  /** 已付金额 */
  HavePaid: number
  /** 未付款 */
  Unpaid: number
  /** 运费 */
  Freight: number
}

/**
 * 下单生产工期信息
 *
 * @interface IProducePeriod
 */
interface IProducePeriod {
  /** 生产完成时间 */
  ProduceEndTime: string
  /** 生产工时 */
  ProduceHour: number
  /** 发货时间时间 */
  ShiftTime: string
}

/**
 * 创建订单信息
 *
 * @export
 * @interface IPlaceOrderInfo
 */
export interface IPlaceOrderInfo {
  ID: string
  /** 订单状态 */
  Status: OrderStatusEnum
  /** 销售端订单号  */
  SalesOrderID: number
  /** 销售平台信息  */
  SalesPlatfrom: IBaseProperty<number>
  /** 订单内容  */
  Content: string
  /** 订单描述  */
  Remark: string
  /** 订单名称(审稿原设置)  */
  OrderName: string
  /** 需要的生产线 */
  LineList: IProductionLineSet[]
  /** 需要生产线中选中的工序 */
  WorkingList: IWorkingProcedureInfo[]
  /** 实例列表 */
  InstanceList: IProductionInstance[]
  /** 产品属性 */
  Attribute: IProductAttribute
  /** 收货方式 */
  ReceiveType: ReceiveTypeEnum
  /** 订单配送地址 */
  Address: IDeliveryAddress
  /** 客户信息 */
  Customer: IPlaceCustomerInfo
  /** 订单金额信息 */
  Funds: IOrderFund
  /** 生产工期  */
  ProducePeriod: IProducePeriod
  /** 下单时间 */
  CreateTime: string
  /** 是否需要打包 */
  NeedPacked: boolean
}

/** 所有可用生产线信息的类型（生产线|组合生产线，简略） */
export type ProductLineSimpleType = Pick<IProductionLineSet, 'ID'|'Name'|'Type'>;

/** 生产线物料类型 */
export interface IFactoryMaterialList {
  ID: string,
  Name: string,
  TypeID: string,
}

export interface IProductionInstanceOriginData extends ProductLineSimpleType {
  /** 接口获取到的生产线详细信息 */
  Detail: IProductionLineDetail
}

interface ISubmitParamsInstanceList extends Omit<PlaceOrderProductionInstance, 'FileList'> {
  FileList: Partial<IConvertOrderFile>[]
}

export interface ISubmitParams extends Omit<PlaceOrderClass, 'InstanceList' | 'FileList'> {
  FileList?: Partial<IConvertOrderFile>[]
  InstanceList: ISubmitParamsInstanceList[]
}
