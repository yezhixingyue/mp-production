interface UnitSelectsType {
  UnitID: number,
  Unit: string,
  UnitName: string,
  ProportionUp: number,
  ProportionDown: number,
  UnitPurpose: number
}
interface MaterialAttributesType {
  MaterialID: number,
  CodeID: number,
  AttributeID: number,
  SelectID: number,
  NumericValue: string,
  InputSelectValue: string,
  SelectValue: string,
  AttributeUnit: string,
  IsBrand: true
}
interface SizeSelectsType {
  MaterialID: number,
  Code: string
  SizeID: number,
  SizeDescribe: string
}
export interface MaterialSelectsType {
  CodeID: number,
  Code: string,
  MaterialAttributes: MaterialAttributesType[],
  SizeSelects: SizeSelectsType[]
}
export interface MaterialDataItemType {
  StockUnit: string,
  Code: string,
  UnitSelects: UnitSelectsType[],
  MaterialSelects: MaterialSelectsType[]
}
