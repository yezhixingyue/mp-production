/** 大版状态枚举 */
export enum PlateStatusEnum {
  /** 初始化数据 */
  // Initial = 0,
  /** 等待生产 */
  HaveMakeup = 10,
  /** 生产中 */
  InProduction = 30,
  /** 已生产 */
  Finished = 40,
  /** 大版取消 */
  HaveCancled = 255,
}
