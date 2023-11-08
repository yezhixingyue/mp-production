/** 大版状态枚举 */
export enum PlateStatusEnum {
  /** 待生产 */
  Producibility = 0,
  /** 生产中 */
  InProduction = 30,
  /** 已分切 */
  Finished = 50,
  /** 已取消 */
  HaveCancled = 255,
}

/** 大版类型： 0是印刷版  10是后工版 */
export enum PlateTypeEnum {
  Plate = 0,
  LaterCraft = 10,
}
