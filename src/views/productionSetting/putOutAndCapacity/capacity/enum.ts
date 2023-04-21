/**
 * 产能类型枚举
 *
 * @export
 * @enum {number}
 */
export enum CapacityTypeEnum {
  /** 准备时间 */
  preparation = 0,
  /** 产能 */
  capacity = 1,
  /** 干燥时间 */
  dry = 2,
}

/** 产能设置类型枚举  设置设备产能的时候使用  单位产量|固定时长 */
export enum CalculateTypeEnum {
  /** 单位产量 */
  UnitOutput = 0,
  /** 固定时长 */
  FixedTime = 1,
}
