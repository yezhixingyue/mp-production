import { IMaterialSources } from '@/store/modules/productionSetting/types';
import { MakingGroupTypeEnum } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { ProcessTypeEnum, ReportModeEnum, TemplateTypeEnum } from '../../process/enums';

/**
 * 保存制版组参数
 *
 * @export
 * @interface ISavePlateMakingGroupParams
 */
export interface ISavePlateMakingGroupParams {
  ID: string
  Name: string
  WorkID: string
}

/**
 * 制版组列表项目类型接口
 *
 * @export
 * @interface IPlateMakingGroup
 */
export interface IPlateMakingGroup {
  ID: string
  Name: string
  // WorkID: string
  // 欠缺其它数据？
  Equipments: { ID: string, LineEquipmentID: string }[]
  Materials: IMaterialSources[]
}

export interface IPlateMakingAllGroupType {
  ID: string
  Name: string
  WorkID: string
}

/** 工序类型接口 */
export interface IWorkingProcedureSearch {
  ID: string
  Name: string
  /** 报工方式： 块 大版 订单报工 */
  ReportMode: ReportModeEnum
  /** 工序类型： 普通、印刷、制版、组合、拆分 */
  Type: ProcessTypeEnum
  /** 大版类型：印刷版、其它（ 其它中包含与印刷版相同的模板类型 ） */
  TemplateType: TemplateTypeEnum
  /** 模板类型是否与印刷版相同 */
  IsSameSizeWithPrintingPlate: boolean | null
}

export interface IPlateMakingGroupMaterialSourceSaveData {
  GroupID: string
  Materials: IMaterialSources[]
}

export interface IPlateMakingGroupEquipmentSaveData {
  GroupID: string
  EquipmentIDS: string[]
}

/** 制版组模块使用接口获取到的物料来源信息 */
export interface IPlateMakingGroupSource {
  /** 工序ID */
  WorkingID: string
  /** 物料ID */
  RelationID: string
  /** 物料名称 */
  RelationName: string
  /** 资源类型 */
  Type: MakingGroupTypeEnum
  /** 排序 */
  Index: number
}
