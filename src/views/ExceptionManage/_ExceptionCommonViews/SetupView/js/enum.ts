/**
 * 异常处理方式枚举值
 *
 * @export
 * @enum {number}
 */
export enum SolveTypeEnum {
  /** 撤回至拼版前 */
  rollbackBeforeMakeup = 0,
  /** 重做 */
  remake = 1,
  /** 继续生产（无异常） */
  continue = 2,
}

/**
 * 撤销类型枚举值
 *
 * @export
 * @enum {number}
 */
export enum RevocationTypeEnum {
  /** 撤销当前块 */
  CurrentChunk = 0,
  /** 撤销其它块 */
  OtherChunk = 1,
  /** 撤销此大版 */
  CurrentPlate = 2,
  /** 撤销此子版 */
  CurrentChildPlate = 3,
  /** 撤销指定大版 */
  FixedPlate = 4,
  /** 撤销此订单 */
  CurrentOrder = 5,
}

/**
 * 对象类型 = ['0', '1', '2', '3']
 *
 * @export
 * @enum {number}
 */
export enum TargetTypeEnum {
  /** 块 */
  Chunk = 0,
  /** 大版 */
  Plate = 1,
  /** 订单 */
  Order = 2,
  /** 组合块(因数量拆分的同一个块按照订单报工时组合在一起) */
  UnionChunk = 3,
}

/** 外协异常处理 - 限制类型 */
export enum ExternalErrorLimitTypeEnum {
  /** 不限制 */
  None = 0,
  /** 指定工厂 */
  Fixed = 1,
  /** 排除工厂 */
  Except = 2
}
