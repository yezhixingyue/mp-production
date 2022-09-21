export interface EquipmentGroups {
  ID: string,
  Name: string
}
export interface UseClassEquipmentGroupType {
  ClassID: 0,
  ClassName: string,
  EquipmentGroups: EquipmentGroups[]
}
