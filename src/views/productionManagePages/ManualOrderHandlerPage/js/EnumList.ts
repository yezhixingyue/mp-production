import { PlaceOrderMaterialSourceEnum, PrintColorEnum, ReceiveTypeEnum } from './enums';

export const ReceiveTypeEnumList = [
  {
    ID: ReceiveTypeEnum.pickupBySelf,
    Name: '自取',
  },
  {
    ID: ReceiveTypeEnum.homeDelivery,
    Name: '送货上门',
  },
  {
    ID: ReceiveTypeEnum.logisticsExpress,
    Name: '物流/快递',
  },
];

/** C、M、Y、K 印色枚举列表 */
export const PrintColorEnumList = [
  {
    ID: PrintColorEnum.C,
    Name: 'C',
  },
  {
    ID: PrintColorEnum.M,
    Name: 'M',
  },
  {
    ID: PrintColorEnum.Y,
    Name: 'Y',
  },
  {
    ID: PrintColorEnum.K,
    Name: 'K',
  },
];

/** 手动下单时设置的物料来源枚举列表 */
export const PlaceOrderMaterialSourceEnumList = [
  {
    ID: PlaceOrderMaterialSourceEnum.warehouse,
    Name: '仓库领料',
  },
  {
    ID: PlaceOrderMaterialSourceEnum.customer,
    Name: '客户送料',
  },
  {
    ID: PlaceOrderMaterialSourceEnum.homePickup,
    Name: '上门取料',
  },
  {
    ID: PlaceOrderMaterialSourceEnum.logisticsExpress,
    Name: '物流/快递',
  },
];
