import { ConditionItemClass } from '@/components/common/ConstraintsComps/ConditionSetupPanel/ConditionItemClass';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { CalculateTypeEnum, CapacityTypeEnum } from '../capacity/enum';

/**
 * 产能列表条目类
 *
 * @export
 * @class CapacityConditionItemClass
 * @extends {ConditionItemClass}
 */
export class CapacityConditionItemClass extends ConditionItemClass {
  LineEquipmentID = ''

  Value: '' | number = 0

  Type: CapacityTypeEnum = CapacityTypeEnum.preparation

  /** 产能设置类型枚举 */
  CalculateType: CalculateTypeEnum = CalculateTypeEnum.UnitOutput

  Property: PropertyListItemType | null = null
}
