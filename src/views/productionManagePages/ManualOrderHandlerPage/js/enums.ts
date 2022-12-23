/**
 * 订单状态
 *
 * @export
 * @enum {number}
 */
export enum OrderStatusEnum {
  /** 待下单 */
  pendingOrder = 0,
}

/**
 * 印面枚举
 *
 * @export
 * @enum {number}
 */
export enum PrintSideEnum {
  /** 单面 */
  single = 0,
  /** 双面 */
  double = 1,
}

/**
 * 订单收货方式
 *
 * @export
 * @enum {number}
 */
export enum ReceiveTypeEnum {
  /** 自取 */
  pickupBySelf = 0,
  /** 送货上门 */
  homeDelivery = 1,
  /** 物流快递 */
  logisticsExpress = 2
}

/**
 * CMYK印色枚举
 *
 * @export
 * @enum {number}
 */
export enum PrintColorEnum {
  /** 青色 */
  C = 0,
  /** 洋红 */
  M = 1,
  /** 黄色 */
  Y = 2,
  /** 黑色 */
  K = 3,
}

/**
 * 手动生产下单中的物料来源枚举（ 主料使用，替换生产线工序中物料来源为“预出库”或“领料”的来源方式 ）
 *
 * @export
 * @enum {number}
 */
export enum PlaceOrderMaterialSourceEnum {
  /** 仓库领料 */
  warehouse = 0,
  /** 客户送料 */
  customer = 1,
  /** 上门取料 */
  homePickup = 2,
  /** 物流/快递 */
  logisticsExpress = 4,
}

/**
 * 下单步骤枚举
 *
 * @export
 * @enum {number}
 */
export enum PlaceStepEnum {
  First = 1,
  Second = 2,
  Third = 3,
  Fourth = 4,
}
