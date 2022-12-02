import { ReceiveTypeEnum } from './enums';
import { PlaceOrderProductionInstance } from './PlaceOrderProductionInstance';

export class PlaceOrderClass {
  /** 工期时间 */
  ProducePeriod = {
    /** 发货时间 */
    ShiftTime: '',
  }

  /** 客户信息 */
  Customer = {
    CustomerName: '',
    Mobile: '',
  }

  /** 交货方式 */
  ReceiveType: ReceiveTypeEnum | '' = ''

  /** 收货信息 */
  Address = {
    Express: {
      First: '',
      Second: '',
    },
    ExpressText: '',
    Address: {
      Consignee: '',
      Mobile: '',
      AddressDetail: '',
    },
  }

  /** 产品信息 */
  ProductAttribute = {
    /** 产品数量 */
    ProductAmount: '',
    /** 数量单位 */
    Unit: '',
  }

  /** 需要打包 */
  NeedPacked = false

  /** 印刷内容 */
  Content = ''

  /** 价格信息 */
  Funds = {
    /** 成交价(不包含运费) */
    FinalPrice: '',
    /** 运费 */
    Freight: '',
  }

  InstanceList: PlaceOrderProductionInstance[] = []
}
