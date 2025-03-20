// import { IEquipmentBaseInfo } from '@/views/ProductionClient/assets/js/types';
import { PlateStatusEnum, PlateTypeEnum } from './enum';

interface _IManagePlateCommonInfo {
  ID: string
  /** 大版编号 */
  Code: number
  /** 模板 */
  Template: string
  /** 模板尺寸 */
  TemplateSize: string
  /** 物料 */
  Material: string
  /** 物料尺寸 */
  MaterialSize: string
  /** 印刷数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 包含块数量  */
  ChunkNumber: number
  /** 内容占比 */
  Percent: number
  /** 拼版时间 */
  CreateTime: string
  /** 最早发货时间 */
  FastDepartureTime: string
  /** 操作人 */
  Operator: string
  /** 生产线 */
  Line: string
  /** 当前位置 */
  // Equipment: IEquipmentBaseInfo
  Position: string
  /** 状态 */
  Status: PlateStatusEnum
  /** 条码稿 */
  MapFilePath: string
  /** 大版序号 */
  Index: string
  /** 大版翻版方式 */
  ReproductionType: string
  /** 大版类型 */
  Type: PlateTypeEnum
}

export type IPlateListChild = _IManagePlateCommonInfo

export interface IManagePlateInfo extends _IManagePlateCommonInfo {
  FileDic?: { [key: string] : string }
  /** 生成大版出错信息 */
  FileError?: string
  /** 子板列表 */
  ChildList: IPlateListChild[]
}
