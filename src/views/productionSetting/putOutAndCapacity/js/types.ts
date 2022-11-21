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

/**
 * 设备组保存后返回的数据类型 - 通用
 *
 * @export
 * @interface ISaveResult
 */
export interface IEquipmentGroupSaveResult {
  EquipmentID: string
  IsRemove: boolean
  LineEquipmentID: string
}
