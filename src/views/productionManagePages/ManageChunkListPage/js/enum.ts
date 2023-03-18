/** 块状态枚举 */
export enum ChunkStatusEnum {
  /** 等待物料 */
  WaitMaterial = 0,
  /** 待生产 */
  Producibility = 10,
  /** 生产中 */
  InProduction = 30,
  /** 已完成 */
  Finished = 50,
  /** 块重新拼版 */
  ChunkReMakeup = 251,
  /** 订单重新拼版 */
  OrderReMakeup = 252,
  /** 订单取消 */
  HaveCancled = 255,
}
