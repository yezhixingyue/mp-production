interface UnitSelectsType {
  UnitID: string,
  Unit: string,
  UnitName: string,
  ProportionUp: number,
  ProportionDown: number,
  UnitPurpose: number
}
interface MaterialAttributesType {
  MaterialID: string,
  CodeID: number,
  AttributeID: string,
  SelectID: string,
  NumericValue: number,
  InputSelectValue: string,
  SelectValue: string,
  AttributeUnit: string,
  IsBrand: true
}
interface SizeSelectsType {
  MaterialID: string,
  Code: string
  SizeID: string,
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
