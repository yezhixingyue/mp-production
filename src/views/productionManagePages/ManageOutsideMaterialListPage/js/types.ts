import { IEquipmentBaseInfo, INextWorkingProduction } from '@/views/ProductionClient/assets/js/types';
import { TargetTypeEnum } from '@/views/ExceptionManage/_ExceptionCommonViews/SetupView/js/enum';
import { PlaceOrderMaterialSourceEnum } from '../../ManualOrderHandlerPage/js/enums';
import { ICustomerAddress } from '../../ManualOrderHandlerPage/js/types';
import { ExternalMaterialStatusEnum } from './enum';

/** 用于打印外来物料清单数据 */
export interface IExternalMaterialPrintBaseData {
  /** 编号 */
  Code: string
  /** 生产线  */
  LineName: string
  SKU: string
  Name: string
  SizeName: string
  OriginalWidth: number
  OriginalHeight: number
  /** 数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 开数 */
  Multiple: number
  /** 开料机台 */
  SplitEquipment?: IEquipmentBaseInfo
  /** 交接机台 */
  ReceiveEquipment: IEquipmentBaseInfo
}

/**
 * 外来物料列表条目类型
 *
 * @export
 * @interface IExternalMaterialDetail
 */
export interface IExternalMaterialDetail extends IExternalMaterialPrintBaseData {
  ID: string
  /** 销售端 */
  Server: string
  /** 客户名称 */
  Customer: string
  /** 客户手机号 */
  Mobile: string
  /** 取料地址 */
  Address: ICustomerAddress
  /** 操作人 */
  Operator: string
  /** 状态 */
  Status: ExternalMaterialStatusEnum
  /** 创建时间 */
  CreateTime: string
  /** 到货时间 */
  ReceiveTime: string
  /** 下一道工序 */
  NextWorking: INextWorkingProduction
  /** 物料来源 */
  MaterialSource: PlaceOrderMaterialSourceEnum
  /** 类型 */
  TargetType: TargetTypeEnum
  /** 订单/大版编码 */
  TargetCode: string
}

export type ExternalMaterialPrintDataType = IExternalMaterialPrintBaseData & Pick<IExternalMaterialDetail, 'TargetCode' | 'TargetType' | 'MaterialSource'>
