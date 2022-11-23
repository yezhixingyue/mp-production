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

/**
 * 生产线物料来源枚举
 *
 * @export
 * @enum {number}
 */
export enum MaterialSourceTypeEnum {
  /** 其它生产线 */
  otherLine = 0,
  /** 预出库 */
  outOfStorage = 1,
  /** 领料 */
  picking = 2,
  /** 其它工序 */
  otherPrcess = 3,
}

export const MaterialSourceTypeEnumObj = {
  otherLine: {
    ID: MaterialSourceTypeEnum.otherLine,
    Name: '其它生产线',
  },
  outOfStorage: {
    ID: MaterialSourceTypeEnum.outOfStorage,
    Name: '预出库',
  },
  picking: {
    ID: MaterialSourceTypeEnum.picking,
    Name: '领料',
  },
  otherPrcess: {
    ID: MaterialSourceTypeEnum.otherPrcess,
    Name: '其它工序',
  },
};

/**
 * 获取工序列表的类型枚举
 *
 * @export
 * @enum {number}
 */
export enum FetchWorkingProcedureSearchEnum {
  /** 组合工序 */
  Combination = 0,
  /** 非组合工序 */
  NotCombination = 1,
  /** 拆分工序 */
  Split = 2,
  /** 订单报工的非组合工序 */
  OrderReportNotCombination = 3,
  /** 制版工序 */
  PlateMaking = 4
}
