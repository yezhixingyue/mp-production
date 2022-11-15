import type { UseClassEquipmentGroupType } from '@/components/pasteupSetting/types';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import { LineStatusEnum } from './enums';
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
  UseModule: UseModuleEnum,
  MaterialTypeList: string[]
}
// 生产线工序列表

export interface IEquipments {
  LineEquipmentID: string,
  ID: string,
  Name: string,
}
export interface IEquipmentGroups {
  GroupID: string,
  GroupName: string,
  Equipments: IEquipments[],
}
export interface IClassEquipmentGroups {
  ClassID: number,
  ClassName: string,
  EquipmentGroups: IEquipmentGroups[],
}
export interface IMaterialSources {
  MaterialTypeID: string,
  SourceType: number,
  SourceWorkIDS: string[],
  NeedSource: boolean,
}
export interface IProductionLineWorkings {
  LineID: string,
  WorkID: string,
  LineWorkID: string,
  ClassEquipmentGroups: IClassEquipmentGroups[],
  MaterialSources: IMaterialSources[],
}
export interface IWorkingProcedureList {
  LineType: number,
  TemplateIDS: string[],
  ProductionLineWorkings: IProductionLineWorkings[] | null,
  Status: LineStatusEnum,
}
