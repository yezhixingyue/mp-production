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
  /** 未赋值前不能用该字段 */
  _Name: string
  /** 数据库赋值 */
  Name?: string
  /** 辅助信息类型 */
  Type: AssistInfoTypeEnum
  /** 文字信息 */
  Content: string
  /** 数值信息 */
  Value: number | ''
  /** 文件路径  */
  FilePath: string
  /** 该文件是否为图片文件 */
  IsImage?: boolean

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
  AssistList?: { ID: string }[]
  /** 存放辅助文件信息 仅辅助文件有 */
  _NoteInfo?: ILineWorkingNoteInfo
  /** 拼版模版id */
  Template?: {
    ID: string
  }
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
    Index: '' | number
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

export interface ICustomerAddress {
  /** 收货人 */
  Consignee: string
  /** 手机号 */
  Mobile: string
  /** 配送区域 */
  ExpressArea: IAddressAreaCell
  /** 详细地址 */
  AddressDetail: string
}

interface IWorkingInstance extends Pick<IWorkingProcedureInfo, 'ID' | 'Type' | 'ReportMode' | 'AllowPartReport' | 'MinPartReportNumber' | 'AllowBatchReport'> {
  /** 加工顺序 */
  Index: number
  /** 加工次数 */
  WorkTimes: number
}

interface IProductionInstanceAttributeMaterial {
  /** 物料ID */
  ID: string
  /** 物料属性关系 下方这些字段在后面使用到的时候再进行补充 */
  // MaterialRelationAttributes
  // MaterialRelationBrands
  // MaterialCode
  // SizeIDS
}

/** 实例上的属性 */
interface IProductionInstanceAttribute {
  /** 物料类型ID */
  MaterialTypeID: string
  /** 物料信息 */
  Material: IProductionInstanceAttributeMaterial
}

/** 大版信息，仅补充了ID，其它属性在后面使用到的时候再补充 */
interface IPlateInfo {
  ID: string
  /** 大版编号 */
  Code: number
}

/**
 * 生产实例
 *
 * @interface IProductionInstance
 */
export interface IProductionInstance {
  ID: string
  Name: string
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
  /** 物料来源 = ['0', '1', '2', '3'] */
  MaterialSource: PlaceOrderMaterialSourceEnum
  /** 物料ID */
  Material: string
  /** 生产线 */
  LineList: IProductionLineSet[]
  /** 工序 */
  WorkingList: IWorkingInstance[]
  /** 辅助信息列表 */
  AssistList: IConvertAssistInfo[]
  /** 文件列表 */
  FileList: IConvertOrderFile[]
  /** 禁止合拼 */
  ForbitUnionMakeup: boolean
  /** 输出半成品 */
  SemiFinished: IBaseProperty<string>
  /** 物料取货地址 */
  Address: ICustomerAddress
  /** 实例属性 */
  Attribute: IProductionInstanceAttribute
  /** 计算属性 后面用到再补充 */
  // CalculateAttribute
  /** 大版列表 */
  PlateList: IPlateInfo[]
  /** 当前大版 */
  CurrentPlate: IPlateInfo
  /** 当前工序 */
  CurrentWorking: IWorkingInstance
}

/**
 * 订单 - 产品属性
 *
 * @interface IProductAttribute
 */
export interface IProductAttribute {
  /** 产品一级分类 */
  FirstLevel?: IBaseProperty<number>
  /** 产品二级分类 */
  SecondLevel?: IBaseProperty<number>
  /** 产品信息 */
  Product?: IBaseProperty<string>
  /** 款数 */
  KindCount: number
  /** 数量 */
  ProductAmount: number
  /** 尺寸 */
  Size: string
  /** 产品单位 */
  Unit: string
}

/** 网点信息 */
interface IDelivery {
  /** 网点编码 */
  StationSN: string
  /** 网点名称 */
  StationName: string
  /** 片区编码 */
  DistrictSN: string
  /** 片区名称 */
  DistrictName: string
}

/**
 * 下单客户收货地址
 *
 * @interface IDeliveryAddress
 */
interface IDeliveryAddress {
  /** 订单ID */
  OrderID: string
  Express: {
    /** 配送方式 */
    First: number
    /** 配送公司ID */
    Second: number
  },
  /** 网点信息 - 物流区域 */
  Delivery: IDelivery
  /** 配送公司名称 */
  ExpressText: string
  Address: {
    Consignee: string
    Mobile: string
    ExpressArea: IAddressAreaCell
    AddressDetail: string
  }
}

/**
 * 下单客户信息
 *
 * @interface IPlaceCustomerInfo
 */
interface IPlaceCustomerInfo {
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
 * 订单条目信息
 *
 * @export
 * @interface IManageOrderInfo
 */
export interface IManageOrderInfo {
  ID: string
  /** 订单ID */
  OrderID: string
  /** 订单状态 */
  Status: OrderStatusEnum
  /** 销售端订单号  */
  SalesOrderID: number
  /** 销售平台信息  */
  SalesPlatfrom?: IBaseProperty<number>
  /** 订单内容  */
  Content: string
  /** 订单描述  */
  Remark: string
  /** 订单名称(审稿原设置)  */
  OrderName: string
  /** 需要的生产线 */
  LineList: IProductionLineSet[]
  /** 需要生产线中选中的工序 */
  WorkingList: IWorkingInstance[]
  /** 实例列表 */
  InstanceList: IProductionInstance[]
  /** 辅助信息列表 */
  AssistList: IConvertAssistInfo[]
  /** 文件列表 */
  FileList: IConvertOrderFile[]
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
  /** 当前生产实例 */
  CurrentInstance: IProductionInstance
  /** 计算属性 后面用到再补充 */
  // CalculateAttribute
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
  InstanceList: Partial<ISubmitParamsInstanceList>[]
}
