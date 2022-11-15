import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';

interface MaterialType {
  ID: string,
  Name: string,
}
interface Property{
  ID: string,
  Name: string,
}
interface Assist{
  ID: string,
  Name: string,
}
interface ValueRange{
  MinValue: number,
  MaxValue: number,
}
interface OptionList{
  First: string,
  Second: string,
}
interface PropertyType {
  ID: string,
  PositionID: UseModuleEnum,
  Type: number,
  UseModule: number,
  MaterialType: MaterialType,
  Property: Property,
  Assist: Assist,
  IsNumberic: boolean,
  DisplayContent: string,
  StoredContent: string,
  FixedType: number,
  Unit: string,
  ValueType: number,
  OperatorList: number[],
  ValueRange: ValueRange,
  OptionList: OptionList[],
}

interface ValueListType {
  ValueType: number,
  Value: string,
  NumbericValue: number,
  GuidValue: string,
  BoolValue: boolean,
  TimeValue: string,
}
export interface ItemListType {
  ConstraintID: string,
  Property: PropertyType,
  Operator: number,
  ValueList: ValueListType[],
  _key:string
}
export interface ConstraintType {
  ConstraintID: string,
  FilterType: number,
  ItemList: ItemListType[],
}
export interface PutOutType {
  ID: number,
  LineEquipmentID: string,
  Priority: number,
  Value: number,
  Type: number,
  Constraint: ConstraintType
}
