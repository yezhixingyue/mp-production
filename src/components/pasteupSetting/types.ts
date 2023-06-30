export interface EquipmentGroups {
  ID: string,
  Name: string,
  AllowBatchReport?: null | boolean
}
export interface UseClassEquipmentGroupType {
  ClassID: 0,
  ClassName: string,
  ID: number,
  Name: string,
  EquipmentGroups: EquipmentGroups[]
}
