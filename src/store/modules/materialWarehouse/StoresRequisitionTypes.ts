export interface IMaterial {
  ClassID: number,
  ClassName: string,
  TypeID: string,
  TypeName: string,
  MaterialID: string,
  MaterialName: string
}

export interface IEquipment{
  ClassID: number,
  ClassName: string,
  IsExternalFactory: boolean,
  GroupID: string,
  GroupName: string,
  ID: string,
  Name: string
}

export interface IList {
  ID: string,
  Code: string,
  PlateCode: number,
  Material: IMaterial,
  SKU: string,
  SizeID: string,
  SizeName: string,
  Number: number,
  Unit: string,
  ReceiveEquipment: IEquipment,
  SplitEquipment: IEquipment,
  Status: number,
  CreateTime: string,
  ProductionLine:string
  SplitNumber:string
  SplitCount:string
}
