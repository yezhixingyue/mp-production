import { ConditionItemClass } from '@/components/common/ConstraintsComps/ConditionSetupPanel/ConditionItemClass';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';

export interface IFormulaItem extends ConditionItemClass {
  UseModule?: UseModuleEnum
  PositionID?: string
  Content: string
  PropertyList: PropertyListItemType[]
}

export interface IFormulaParams {
  UseModule: UseModuleEnum;
  PositionID: string;
  [key: string]: any
}
