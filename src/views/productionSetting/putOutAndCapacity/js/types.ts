export interface ILineEquipmentSaveParams {
  LineWorkID: string,
  EquipmentIDS: string[]
}

export interface EquipmentListType {
  ClassID:number
  ClassName:string
  GroupID:string
  GroupName:string
  ID:string
  Name:string
  LineEquipmentID?:string
}
