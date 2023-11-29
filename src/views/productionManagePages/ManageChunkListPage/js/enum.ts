/** 块状态枚举 */
export enum ChunkStatusEnum {
  /** 待生产 */
  Producibility = 0,
  /** 生产中 */
  InProduction = 30,
  /** 已完成 */
  Finished = 50,
  /** 订单取消 */
  HaveCancled = 255,
}
