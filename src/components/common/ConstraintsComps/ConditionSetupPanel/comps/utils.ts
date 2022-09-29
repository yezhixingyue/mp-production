import { PropertyValueTypeEnum } from '../../TypeClass/enum';
import { PropertyListItemType } from '../../TypeClass/Property';
import { ConstraintsItemClass } from '../ConstraintsItemClass';

// 是否为值类型
export const getIsNumericalType = (Property:PropertyListItemType | null) => Property && [PropertyValueTypeEnum.numerical].includes(Property.ValueType);

// 是否为选项类型（可多选）
export const getIsMultipleType = (Property:PropertyListItemType | null) => {
  if (Property) {
    return [PropertyValueTypeEnum.multiple, PropertyValueTypeEnum.radio].includes(Property.ValueType);
  }
  return false;
};

/**
 * 获取条件中属性的值
 *
 * @param {ConstraintsItemClass} item 条件条目
 * @returns
 */
export const getConstraintsItemValue = (item: ConstraintsItemClass) => {
  let val: string | number | Array<string | number> = '';
  const isNumerical = getIsNumericalType(item.Property);
  const isMultiple = getIsMultipleType(item.Property);
  if (isNumerical && item.ValueList.length > 0) {
    val = item.ValueList[0].Value;
  }
  if (isMultiple) {
    val = item.ValueList.map(it => it.Value);
  }
  return val;
};

/**
 * 转换属性值为保存格式
 *
 * @param {ConstraintsItemClass} item
 * @param {(string | number | (string | number)[])} value
 * @returns
 */
export const getgetConstraintsItemSubmitValue = (item: ConstraintsItemClass, value: string | number | (string | number)[]) => {
  let val;
  const isNumerical = getIsNumericalType(item.Property);
  const isMultiple = getIsMultipleType(item.Property);
  if (isNumerical) {
    val = [{ Value: value }];
  }
  if (isMultiple && typeof value === 'object') {
    val = value.map(Value => ({ Value }));
  }
  return val;
};
