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
