/** 大版状态枚举 */
export enum PlateStatusEnum {
  /** 等待物料 */
  WaiteMaterial = 0,
  /** 待生产 */
  Producibility = 10,
  /** 生产中 */
  InProduction = 30,
  /** 已完成 */
  Finished = 50,
  /** 大版取消 */
  HaveCancled = 255,
}
