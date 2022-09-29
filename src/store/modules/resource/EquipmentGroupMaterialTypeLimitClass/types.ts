import { Constraints } from '@/components/common/ConstraintsComps/ConditionSetupPanel/Constraints';

export interface IMaterialTypeLimitSaveParams {
  GroupID: string,
  MaterialTypeIDS: string[],
}

export interface ILimitConstraintsItem {
  ID: '' | number
  GroupMaterialTypeID: string
  Constraint: null | Constraints
}
