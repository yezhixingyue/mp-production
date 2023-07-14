import { IProductionLineSet } from '@/assets/Types/ProductionLineSet/types';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
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
  FilePath?: string
  /** 该文件是否为图片文件 */
  IsImage?: boolean
  TaskWorkingID?: string
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
  Template?: { ID: string } | null
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

/** 从销售系统检索引入获取到的订单信息类型 */
export type SourceOrderData = Pick<PlaceOrderClass, 'Address' | 'Customer' | 'ProducePeriod' | 'Attribute' | 'Content' | 'Funds'> & {
  Attribute: {
    Remark: null | string
  }
  SellOrderID: number | string
  Address: {
    Address: {
      ExpressArea: {
        RegionalName: string
        CityName: string
        CountyName: string
      }
    }
  }
}
