// 辅助信息
export interface NotesType{
  ID: string,
  Name: string
  Type?: number,
}
export interface SelectAssistInfoGroup{
  Type: number,
  Notes: NotesType[]
}
// 所有物料资源
export interface MaterialTypeGroupsType{
  CategoryID: number,
  MaterialTypeIDS: string[]
}
export interface MaterialTypeGroupType{
  Feature: number,
  MatchType: number,
  MaterialTypeGroups: MaterialTypeGroupsType[],
  ID: string,
  Name: string
}
// g工序列表
export interface EquipmentGroupsType{
  GroupID: string,
  Weight: number,
  OneTimeTwoSide: boolean,
}
export interface RelationsType{
  RelationID: string,
  Type: number
}
export interface ProcessListType{
  isRestrict:boolean,
  CreateTime: string,
  ReportMode: number,
  Type: number,
  MaxProduceNumber: number,
  AllowPartReport: boolean,
  MinPartReportNumber: number,
  AllowBatchReport: boolean,
  TemplateType: number,
  EquipmentGroups: EquipmentGroupsType[],
  Relations: RelationsType[],
  ID: string,
  Name: string,
}
