import { ConditionItemClass } from '../ConditionSetupPanel/ConditionItemClass';
import { Constraints, FilterTypeEnum, FilterTypeMpEnums } from '../ConditionSetupPanel/Constraints';
import { ConstraintsItemClass } from '../ConditionSetupPanel/ConstraintsItemClass';
import { PropertyListItemType } from '../TypeClass/Property';
import { PropertyListClass } from '../TypeClass/PropertyListClass';

interface IOptions<T> {
  tableList: T[] | null
  PropertyList: PropertyListItemType[]
  getRowContent?: (it: T) => string
}

const formatConstraint = (Constraint: Constraints | null, PropertyList: PropertyListItemType[]) => {
  if (!Constraint) return Constraint;

  const ItemList = Constraint.ItemList.map(origin => new ConstraintsItemClass({ origin, PropertyList }));

  const temp = {
    ...Constraint,
    _FilterTypeText: Constraint.FilterType === FilterTypeEnum.all ? FilterTypeMpEnums.all.Name : FilterTypeMpEnums.one.Name,
    ItemList,
    _contentTextList: PropertyListClass.getPropertyConditionText(ItemList),
  };

  return temp;
};

export type TransformConstraintTableItemType<T> = T & {
  _Content: string
  Constraint: ReturnType<typeof formatConstraint>
}

/**
 * 转换添加列表数据为可用数据
 * 1. 补充Property完整信息   2. 添加条件文字说明
 * @param {*} tableList
 * @returns
 */
export const transformConstraintTableList = <T extends ConditionItemClass = ConditionItemClass>({
  tableList,
  PropertyList,
  getRowContent,
}: IOptions<T>): TransformConstraintTableItemType<T>[] => {
  if (!tableList) return [];
  const list = tableList.map(it => {
    const Constraint = formatConstraint(it.Constraint, PropertyList);
    const _Content = getRowContent ? getRowContent(it) : '';
    const temp = {
      ...it,
      _Content,
      Constraint,
    };
    return temp;
  });
  return list;
};

export interface IConditionDisplayItemObj {
  _FilterTypeText: string;
  _contentTextList: string | ({
      name: string;
      operator: string;
      val: string | number;
  })[];
  FilterType: FilterTypeEnum;
}
