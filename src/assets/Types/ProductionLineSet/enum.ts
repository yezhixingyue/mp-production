/**
 * 生产线类型枚举
 *
 * @export
 * @enum {number}
 */
export enum LineTypeEnum {
  /** 生产线 */
  normal = 0,
  /** 组合生产线 */
  combine = 1,
}

/**
 * 生产线状态 是否可用
 *
 * @export
 * @enum {number}
 */
export enum LineStatusEnum {
  /** 不可用 */
  disabled = 0,
  /** 可用 */
  usable = 1,
}

/** 普通生产线的特殊类型枚举： 普通 | 数码生产线 | 专版生产线 */
export enum NormalLineCategoryTypeEnum {
  /** 普通 */
  normal = 0,
  /** 数码生产线 */
  digital = 1,
  /** 专版生产线 */
  special = 2,
}
