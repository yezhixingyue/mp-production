/** 块状态枚举 */
export enum ChunkStatusEnum {
  /** 初始化数据 */
  // Initial = 0,
  /** 等待生产 */
  HaveMakeup = 10,
  /** 生产中 */
  InProduction = 30,
  /** 已生产 */
  Finished = 40,
  /** 块取消 */
  HaveCancled = 255,
}
