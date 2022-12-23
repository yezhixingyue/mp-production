import { getEnumList } from '@/assets/js/utils/getListByEnums';

/**
 * 翻版方式枚举
 *
 * @export
 * @enum {number}
 */
export enum ReproductionTypeEnum {
  /** 正反版 */
  FrontBack = 0,
  /** 自翻版 */
  SelfReproduction = 1,
  /** 滚翻版 */
  RollOver = 2,
}

export const ReproductionTypeEnumObj = {
  FrontBack: {
    ID: ReproductionTypeEnum.FrontBack,
    Name: '正反版',
  },
  SelfReproduction: {
    ID: ReproductionTypeEnum.SelfReproduction,
    Name: '自翻版',
  },
  RollOver: {
    ID: ReproductionTypeEnum.RollOver,
    Name: '滚翻版',
  },
};

/** 翻版方式列表 */
export const ReproductionTypeEnumList = getEnumList(ReproductionTypeEnumObj);

/**
 * 是否允许按模位枚举
 *
 * @export
 * @enum {number}
 */
export enum LineIsUseModeEnum {
  /** 不限 */
  NoLimit = 0,
  /** 必须按模位 */
  Required = 1,
  /** 禁止按模位 */
  Forbid = 2,
}

export const LineIsUseModeEnumObj = {
  NoLimit: {
    ID: LineIsUseModeEnum.NoLimit,
    Name: '不限',
  },
  Required: {
    ID: LineIsUseModeEnum.Required,
    Name: '必须按模位',
  },
  Forbid: {
    ID: LineIsUseModeEnum.Forbid,
    Name: '禁止按模位',
  },
};

/** 是否允许按模位枚举列表 */
export const LineIsUseModeEnumList = getEnumList(LineIsUseModeEnumObj);
