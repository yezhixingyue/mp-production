interface UnitSelectsType {
  UnitID: number,
  Unit: string,
  ProportionUp: number,
  ProportionDown: number,
  UnitPurpose: number
}
interface MaterialAttributesType {
  MaterialID: number,
  AttributeID: number,
  SelectID: number,
  NumericValue: string,
  InputSelectValue: string,
  SelectValue: string,
  AttributeUnit: string,
  IsBrand: boolean
}
// 根据sku编码或者物料查询的物料
interface MaterialInfoType {
  MaterialID: number,
  Code: string,
  SizeDescribe: string,
  MaterialAttributes: MaterialAttributesType[],
  StockUnit: string,
  UnitSelects: UnitSelectsType[]
}

export {
  MaterialInfoType,
};
