/**
 * 工序来源类型
 *
 * @enum {number}
 */
export enum WorkSourceTypeEnum {
  /** 一般工序 */
  Normal = 0,
  /** 制版工序 */
  PlateMaking = 1,
  /** 分切工序 */
  Split = 2,
}

/** 伸放类型： % | 张 */
export enum PutOutTypeEnum {
  number = 0,
  percent = 1,
}
