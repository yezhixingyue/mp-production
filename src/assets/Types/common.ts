import { RouteLocationRaw } from 'vue-router';

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
interface ISize {
  ID: string,
  Name: string,
  SizeHeight: number,
  SizeWidth: number,
}
// 根据sku编码或者物料查询的物料
interface MaterialInfoType {
  MaterialID: string,
  TypeID?: string,
  Code: string,
  Size: ISize,
  MaterialAttributes: MaterialAttributesType[],
  StockUnit: string,
  UnitSelects: UnitSelectsType[]
  AttributeDescribe:string
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
export interface StaffSelectListType {
  StaffID: string,
  StaffName: string
}
export interface ExpressListType {
  ID: number,
  Name: string
}

export interface IMpBreadcrumbItem {
  to?: RouteLocationRaw,
  name: string,
  replace?: boolean
}
