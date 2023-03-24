import type { UseClassEquipmentGroupType } from '@/components/pasteupSetting/types';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import { LinePutOutClass } from '@/views/productionSetting/putOutAndCapacity/js/LinePutOutClass';
import { LineCapacityClass } from '@/views/productionSetting/putOutAndCapacity/js/LineCapacityClass';
import { PlateMakingGroupManageClass } from '@/views/productionSetting/PlateMakingGroupView/js/PlateMakingGroupManageClass';
import { PlateMakingWorkSetupClass } from '@/views/productionSetting/productionLine/js/PlateMakingWorkSetupClass';
import { LineStatusEnum } from '@/assets/Types/ProductionLineSet/enum';
import { WorkingProcedureRelationEnum } from '@/views/productionSetting/process/enums';
import { LineIsUseModeEnum, ReproductionTypeEnum } from '@/views/productionSetting/productionLine/js/enum';
import { MakingGroupTypeFeatureEnum, resourceBundleMatchEnum } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';

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
  GroupName: string,
  AllowBatchReport: null | boolean
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
  Feature: MakingGroupTypeFeatureEnum,
  /** 是否为版材 */
  IsPlateMaterial: boolean
  /** 包含的物料类型有哪些 */
  MaterialTypeGroups: MaterialTypeGroupsType[],
  /** 满足方式（任一还是全部） */
  MatchType: resourceBundleMatchEnum,
  ID: string,
  Name: string
}

export interface ImpositionTemmplateListType {
  ID:string,
  Name:string,
}
export interface IEquipmentGroupsType{
  GroupID: string,
  /** 权重 */
  Weight: number,
  /** 可一次印双面 */
  OneTimeTwoSide: boolean,
}

/**
 * 相关资源
 *
 * @export
 * @interface IRelationsType
 */
export interface IRelationsType{
  RelationID: string,
  /** 资源类型,0.辅助信息 1.可选物料资源包 2.其他大版文件(大版类型为其他情况) = ['0', '1', '2']  */
  Type: WorkingProcedureRelationEnum
}

export interface IState {
  EquipmentListGroup:UseClassEquipmentGroupType[],
  ResourceNoteGroup:SelectAssistInfoGroup[],
  MaterialTypeGroup:MaterialTypeGroupType[],
  ImpositionTemmplateList:ImpositionTemmplateListType[],
  PropertyList:PropertyListItemType[]
  LinePutOutPageData: null | LinePutOutClass
  LineCapacityPageData: null | LineCapacityClass
  CombineLinePutOutPageData: null | LinePutOutClass
  CombineLineCapacityPageData: null | LineCapacityClass
  PlateMakingGroupManageData: PlateMakingGroupManageClass
  PlateMakingGroupPutOutPageData: null | LinePutOutClass,
  PlateMakingGroupCapacityPageData: null | LineCapacityClass,
  PlateMakingWorkSetupHander: PlateMakingWorkSetupClass,
}

export interface ImpositionTemmplateListGroupType {
  ClassID:number,
  Name:string,
  children:ImpositionTemmplateListType[],
}
export interface getPropertyListType {
  UseModule: UseModuleEnum,
  EquipmentGroupID: string
}
// 生产线工序列表

export interface IEquipments {
  /** 为空表示没有使用 */
  LineEquipmentID: string | null,
  /** 设备ID */
  ID: string,
  /** 设备名称 */
  Name: string,
}
export interface IEquipmentGroups {
  /** 设备组ID  */
  GroupID: string,
  /** 设备组名称  */
  GroupName: string,
  /** 设备列表 */
  Equipments: IEquipments[],
}
export interface IClassEquipmentGroups {
  /** 设备分类ID  */
  ClassID: number,
  /** 设备分类名称  */
  ClassName: string,
  /** 设备组列表 */
  EquipmentGroups: IEquipmentGroups[],
}
export interface IMaterialSources {
  MaterialTypeID: string,
  MaterialTypeName: string
  SourceType: number | '',
  SourceWorkIDS: string[] | null,
  NeedResource: boolean,
  FactoryProvide: boolean,
  AllowSourceLine: boolean
}
export interface IProductionLineWorkings {
  LineID: string,
  WorkID: string,
  LineWorkID: string,
  ClassEquipmentGroups: IClassEquipmentGroups[],
  MaterialSources: IMaterialSources[],

  /** 制版工序ID */
  PlateMakingWorkID: null | string

  /** 制版工序下的制版组ID（ 仅制版工序为非印刷版相关时才可设置 ） */
  PlateMakingGroupID: null | string
  PlateMakingClassEquipmentGroups: null | IClassEquipmentGroups[],
  PlateMakingMaterialSources: null | IMaterialSources[],

  /** 设置过制版工序后生成的标识ID 用于制版工序上的设备和物料来源保存 */
  PlateMakingWorkIdentID: null | string
}
export interface IWorkingProcedureList {
  LineType: number,
  ProductionLineWorkings: IProductionLineWorkings[] | null,
  Status: LineStatusEnum,
  ProductionLineSplitWorking: null | IProductionLineWorkings
  /** 是否允许按模位，仅生产线 */
  UseModeType: LineIsUseModeEnum,
  /** 允许翻版方式， 仅生产线 */
  ReproductionTypes: ReproductionTypeEnum[]
}
