// import { IEquipmentBaseInfo } from '@/views/ProductionClient/assets/js/types';
import { PlateStatusEnum } from './enum';

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
  /** 印刷数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 包含块数量  */
  ChunkNumber: number
  /** 拼版时间 */
  CreateTime: string
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
}

export type IPlateListChild = _IManagePlateCommonInfo

export interface IManagePlateInfo extends _IManagePlateCommonInfo {
  /** 子板列表 */
  ChildList: IPlateListChild[]
}
