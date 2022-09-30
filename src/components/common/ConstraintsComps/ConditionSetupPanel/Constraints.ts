import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { PropertyListItemType } from '../TypeClass/Property';
import { ConstraintsItemClass } from './ConstraintsItemClass';

export enum FilterTypeEnum {
  all = 1,
  one
}

export const FilterTypeMpEnums = {
  all: {
    ID: FilterTypeEnum.all,
    Name: '满足所有条件',
  },
  one: {
    ID: FilterTypeEnum.one,
    Name: '满足任一条件',
  },
};

export const FilterTypeMpEnumList = getEnumList(FilterTypeMpEnums);

export class Constraints {
  ConstraintID = ''

  FilterType = FilterTypeMpEnums.all.ID

  ItemList: ConstraintsItemClass[] = []

  constructor(data: Constraints | null, PropertyList: PropertyListItemType[]) {
    if (data) restoreInitDataByOrigin(this, data);
    // 转换ItemList 为ConstraintsItemClass类 ?
    if (data) {
      this.ConstraintID = data.ConstraintID;
      this.FilterType = data.FilterType;
      this.ItemList = data.ItemList.map(origin => new ConstraintsItemClass({ origin, PropertyList }));
    }
  }
}
