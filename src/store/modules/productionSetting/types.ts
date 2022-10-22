import type { EquipmentGroups, UseClassEquipmentGroupType } from '@/components/pasteupSetting/types';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
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
interface _EquipmentGroups{
  GroupID: string,
  GroupName: string
}

export interface _UseClassEquipmentGroupType {
  ClassID: 0,
  ClassName: string,
  EquipmentGroups: _EquipmentGroups[]
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

export interface ImpositionTemmplateListType {
  ClassID:number,
  ID:string,
  Name:string,
}

export interface IState {
  EquipmentListGroup:UseClassEquipmentGroupType[],
  ResourceNoteGroup:SelectAssistInfoGroup[],
  MaterialTypeGroup:MaterialTypeGroupType[],
  ImpositionTemmplateList:ImpositionTemmplateListType[],
  PropertyList:PropertyListItemType[]
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
export interface ImpositionTemmplateListGroupType {
  ClassID:number,
  Name:string,
  children:ImpositionTemmplateListType[],
}
export interface getPropertyListType {
  UseModule: number,
  MaterialTypeList: string[]
}
