import { PlateStatusEnum } from './enum';

export interface IPlateListChild {
  /** 大版ID  */
  ID: string
  /** 大版编号  */
  Code: number
  /** 包含块数量 */
  IncludeChunkNumber: number
}

export interface IManagePlateInfo {
  ID: string
  /** 大版编号 */
  Code: number
  /** 尺寸规格 */
  Size: string
  /** 物料 */
  Material: string
  /** 印刷数量 */
  Number: number
  /** 包含块数量  */
  IncludeChunkNumber: number
  /** 拼版时间 */
  CreateTime: string
  /** 操作人 */
  Operator: string
  /** 生产线 */
  Line: string
  /** 当前位置 */
  Equipment: string
  /** 状态 */
  Status: PlateStatusEnum
  /** 子板列表 */
  Children: IPlateListChild[]
}
