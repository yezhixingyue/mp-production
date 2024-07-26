import { IEquipmentGroupsType, IRelationsType } from '@/store/modules/productionSetting/types';
import { ReportModeEnum, WorkingTypeEnum } from '@/views/productionSetting/process/enums';
import { LineIsUseModeEnum, ReproductionTypeEnum } from '@/views/productionSetting/productionLine/js/enum';
import { LineStatusEnum, LineTypeEnum } from './enum';

/**
 * 生产线
 *
 * @export
 * @interface IProductionLineSet
 */
export interface IProductionLineSet {
  ID: string,
  Name: string,
  CreateTime: string,
  /** 分切工序ID */
  SplitWordID: string,
  /** 生产线状态： 可用|不可用 */
  Status: LineStatusEnum,
  /** 生产线类型： 生产线|组合生产线 */
  Type: LineTypeEnum,
  /** 是否需要折手 */
  NeedFoldWay: boolean,
  /** 可用拼版模板 */
  // TemplateIDS: string[],
  /** 组合工序ID，组合生产线才有，可多个 */
  CombinationWordIDS: string[],
  /** 是否允许按模位，仅生产线 */
  UseModeType: LineIsUseModeEnum,
  /** 允许翻版方式， 仅生产线 */
  ReproductionTypes: ReproductionTypeEnum[]
  /** 是否数码生产线 */
  IsDigital: boolean
  /** 该生产线包含的工序列表 */
  WorkingProcedures?: { ID: string; Name: string }[]
}

/**
 * 工序
 *
 * @export
 * @interface IWorkingProcedureInfo
 */
export interface IWorkingProcedureInfo{
  /** 工序ID */
  ID: string,
  Name: string,
  CreateTime: string,
  /** 限制每套版加工数量 */
  isRestrict:boolean,
  /** 报工方式 */
  ReportMode: ReportModeEnum,
  /** 工序类型 */
  Type: WorkingTypeEnum,
  /** 每套版最大加工量 */
  MaxProduceNumber: number,
  /** 允许部分报工 */
  AllowPartReport: boolean,
  /** 部分报工最小数量  */
  MinPartReportNumber: number,
  /** 允许批量报工 */
  AllowBatchReport: boolean,
  /** 大版类型 1.印刷版 2.其他 = ['1', '2'] */
  // TemplateType: TemplateTypeEnum,
  /** 设备组 */
  EquipmentGroups: IEquipmentGroupsType[],
  /** 工序所需资源：辅助信息（文件、文字、数值），物料资源包等 */
  Relations: IRelationsType[],
}
