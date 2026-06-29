import { DigitalFoldTypeEnum } from './enum';

/** 数码折手设置条目 */
export interface IDigitalFoldInfo {
  ID: number
  /** 最小宽度(不含) */
  MinValue: number
  /** 最大宽度(含) */
  MaxValue: number
  /** 折手类型 */
  FoldType: DigitalFoldTypeEnum
  /** 用纸卷宽度 */
  RollWidth: number
  /** 创建时间 */
  CreateTime: string
}
