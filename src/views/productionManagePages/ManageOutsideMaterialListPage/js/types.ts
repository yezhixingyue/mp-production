import { PlaceOrderMaterialSourceEnum } from '../../ManualOrderHandlerPage/js/enums';
import { ICustomerAddress } from '../../ManualOrderHandlerPage/js/types';
import { ExternalMaterialStatusEnum } from './enum';

/**
 * 外来物料列表条目类型
 *
 * @export
 * @interface IExternalMaterialDetail
 */
export interface IExternalMaterialDetail {
  ID: string
  /** 编号 */
  Code: string
  /** 销售端 */
  Server: string
  /** 订单编码 */
  OrderCode: string
  /** 生产线  */
  Line: string
  /** 尺寸 */
  Size: string
  /** 数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 客户名称 */
  Customer: string
  /** 客户手机号 */
  Mobile: string
  /** 物料来源 */
  MaterialSource: PlaceOrderMaterialSourceEnum
  /** 物料尺寸 */
  MaterialSize: string
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
}
