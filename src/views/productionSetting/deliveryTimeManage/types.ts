import { ShiftTypeEnum } from './enums';

export interface setPageObjType{
  RowIndex:number|string
  ColIndex:number|string
}

export interface IAreaList {
  CountryID: number
  ProvinceID: number
  CityID: number
  CountyID: number
}

export interface IExpressList {
  ID: number
  Name: string
}

export interface IShiftTime {
  First: '' | number
  Second: '' | number
}

export interface IShiftRowItem {
  ShiftID: string
  ShiftTime: IShiftTime[]
  ShiftType: ShiftTypeEnum
  TypeLimit: number[]
}

export interface getRecordDataType {
  ProvinceName: string,
  CityName:string,
  CountyName: string,
  CompanyID: number,
  Page: number,
  PageSize: number,
}

export interface IShiftTimeItem {
  ItemID: string
  ItemName: string
  Shift: IShiftRowItem[]
  AreaList: IAreaList[]
  AreaDescribe: string
  ExpressList: IExpressList[]
}
