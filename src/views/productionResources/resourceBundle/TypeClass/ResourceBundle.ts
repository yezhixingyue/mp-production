import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';

export const resourceBundleFeatureEnum = {
  main: {
    ID: 0,
    Name: '主料',
  },
  sup: {
    ID: 1,
    Name: '辅料',
  },
  semifinished: {
    ID: 2,
    Name: '半成品',
  },
};

export const resourceBundleMatchEnum = {
  any: {
    ID: 0,
    Name: '提供任意一种类型物料即可',
  },
  every: {
    ID: 1,
    Name: '每种类型都需要提供物料',
  },
};

export interface IMaterialTypeItemInBundle {
  CategoryID: number
  MaterialTypeIDS: string[]
}

export class ResourceBundleClass {
  ID = ''

  Name = ''

  Feature = resourceBundleFeatureEnum.main.ID

  MatchType = resourceBundleMatchEnum.any.ID

  MaterialTypeGroups: IMaterialTypeItemInBundle[] = [] // 资源包中包含的物料类型列表

  constructor(data) {
    if (data) restoreInitDataByOrigin(this, data);
  }
}

// export type ResourceBundleListItemType = Required<ResourceBundleClass> // 资源包列表项目类型
