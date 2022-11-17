import { ConditionItemClass } from '@/components/common/ConstraintsComps/ConditionSetupPanel/ConditionItemClass';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { CapacityTypeEnum } from '../capacity/enum';

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

  Type: CapacityTypeEnum = 0

  NumberPropertyID: PropertyListItemType | null = null
}
