interface UnitSelectsType {
  UnitID: string,
  Unit: string,
  ProportionUp: number,
  ProportionDown: number,
  UnitPurpose: number
}
interface MaterialAttributesType {
  MaterialID: string,
  AttributeID: string,
  SelectID: string,
  NumericValue: number|null,
  InputSelectValue: string,
  SelectValue: string,
  AttributeUnit: string,
  IsBrand: boolean
}
// 根据sku编码或者物料查询的物料
interface MaterialInfoType {
  MaterialID: string,
  TypeID?: string,
  Code: string,
  SizeDescribe: string,
  MaterialAttributes: MaterialAttributesType[],
  StockUnit: string,
  UnitSelects: UnitSelectsType[]
}

export {
  MaterialInfoType,
  MaterialAttributesType,
};

export interface IDistrictItem {
  ID: number
  Name: string
  Level: number
  ParentID: number
  IsVirtual: boolean
}
