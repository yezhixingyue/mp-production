import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { MakingGroupTypeFeatureEnum } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { MaterialSourceTypeEnum } from '@/views/productionSetting/js/enums';
import { WorkingTypeEnum } from '@/views/productionSetting/process/enums';

/** 工序中大版模板类型（仅制版工序中有该数据） */
export interface IImpositionTemplate {
  ID: string
  Name: string
  /** 是否印刷版 */
  IsPrintingPlate: boolean
  /** 是否和印刷版尺寸一致 */
  IsSameSizeWithPrintingPlate: boolean
  /** 拼版模板尺寸列表 -- 暂不需要，未定义类型 */
  // List: []
  // CreateTime: string
}

/** 工序中需要的辅助信息 */
export interface ILineWorkingNoteInfo {
  ID: string
  Name: string
  /** 辅助信息类型： 0.文件 1.文字信息 2.数值 */
  Type: AssistInfoTypeEnum,
}

/** 工序中需要的物料资源包 -- 组合生产线中使用 */
export interface ILineWorkingMaterialSources {
  MaterialTypeID: string
  MaterialTypeName: string
  /** 资源包性质 0.主料1.辅料 2.半成品 */
  Feature: MakingGroupTypeFeatureEnum,
  /** 物料来源方式 = ['0', '1', '2', '3'] */
  SourceType: MaterialSourceTypeEnum,
  /** 是否为必需资源 */
  NeedSource: boolean
  /** 如果外协是否外协厂自备 */
  FactoryProvide: boolean
  /** 来源工序ID列表 好像用不到 */
  SourceWorkIDS: string[]
}

/**
 * 生产线中工序详细信息
 *
 * @interface ILineDetailWorkingProcedure
 */
export interface ILineDetailWorkingProcedure {
  ID: string
  Name: string
  /** 工序类型： 0.普通工序 1.印刷工序 2.制版工序 3.组合工序 4.拆分工序 */
  Type: WorkingTypeEnum,
  /** 该工序使用的大版模板，仅制版类型有 */
  Template: IImpositionTemplate | null,
  /** 相关资源的辅助信息（可选） */
  NoteInfos: ILineWorkingNoteInfo[]
  /** 工序所需资源包（可选） */
  MaterialSources: ILineWorkingMaterialSources []
}

/**
 * 生产线详细信息 -- 用于手动下单
 *
 * @export
 * @interface IProductionLineDetail
 */
export interface IProductionLineDetail {
  WorkingProcedures: ILineDetailWorkingProcedure[]
}
