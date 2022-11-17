import { ConditionItemClass } from '@/components/common/ConstraintsComps/ConditionSetupPanel/ConditionItemClass';

export class PutOutConditionItemClass extends ConditionItemClass {
  LineEquipmentID = ''

  Value: '' | number = 0

  Type: 0 | 1 = 0 // 后续设置该枚举类型
}
