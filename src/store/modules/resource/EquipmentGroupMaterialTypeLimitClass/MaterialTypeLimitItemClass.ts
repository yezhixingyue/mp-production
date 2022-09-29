import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { ILimitConstraintsItem } from './types';

export class MaterialTypeLimitItemClass {
  ID = ''

  MaterialTypeID = ''

  LimitConstraints: ILimitConstraintsItem[] = [] // 后面专门建立Constraints类来处理

  constructor(data) {
    if (data) restoreInitDataByOrigin(this, data); // 后续根据Constraints情况来决定是否手动还原赋值
  }
}

export type MaterialTypeLimitItemType = Omit<MaterialTypeLimitItemClass, ''>;

export interface IMaterialTypeLimitItemTypeWithName extends MaterialTypeLimitItemType {
  MaterialTypeName: string
  CategoryName: string
}

export interface IMaterialTypeLimitTableItemType extends IMaterialTypeLimitItemTypeWithName {
  title: string
}
