import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';

/**
 * 物料资源类型枚举：主料 辅料 半成品
 *
 * @export
 * @enum {number}
 */
export enum MakingGroupTypeFeatureEnum {
  /** 主料 */
  main = 0,
  /** 辅料 */
  sup = 1,
  /** 半成品 */
  semifinished = 2,
}

export const resourceBundleFeatureEnumObj = {
  main: {
    ID: MakingGroupTypeFeatureEnum.main,
    Name: '主料',
  },
  sup: {
    ID: MakingGroupTypeFeatureEnum.sup,
    Name: '辅料',
  },
  semifinished: {
    ID: MakingGroupTypeFeatureEnum.semifinished,
    Name: '半成品',
  },
};

export enum resourceBundleMatchEnum {
  /** 提供任意一种类型物料即可 */
  single = 0,
  /** 每种类型都需要提供物料 */
  every = 1,
}

export const resourceBundleMatchEnumObj = {
  single: {
    ID: resourceBundleMatchEnum.single,
    Name: '提供任意一种类型物料即可',
  },
  every: {
    ID: resourceBundleMatchEnum.every,
    Name: '每种类型都需要提供物料',
  },
};

/** 半成品类型枚举 */
export enum PartTypeEnum {
  /** 封面 */
  cover = 0,
  /** 内文 */
  insidePage = 1,
  /** 其他 */
  other = 255,
}

/** 半成品类型枚举对象 */
export const PartTypeEnumObj = {
  cover: {
    ID: PartTypeEnum.cover,
    Name: '封面',
  },
  insidePage: {
    ID: PartTypeEnum.insidePage,
    Name: '内文',
  },
  other: {
    ID: PartTypeEnum.other,
    Name: '其他',
  },
};

/** 半成品类型枚举列表 */
export const PartTypeEnumList = getEnumList(PartTypeEnumObj);

export interface IMaterialTypeItemInBundle {
  CategoryID: number
  MaterialTypeIDS: string[]
}

export class ResourceBundleClass {
  ID = ''

  Name = ''

  Feature = MakingGroupTypeFeatureEnum.main

  MatchType: number | '' = resourceBundleMatchEnum.single

  /** 半成品类型 - 仅半成品使用 */
  PartType: PartTypeEnum | '' = ''

  IsPlateMaterial = false

  MaterialTypeGroups: IMaterialTypeItemInBundle[] = [] // 资源包中包含的物料类型列表

  constructor(data) {
    if (data) restoreInitDataByOrigin(this, data);
  }
}

// export type ResourceBundleListItemType = Required<ResourceBundleClass> // 资源包列表项目类型
