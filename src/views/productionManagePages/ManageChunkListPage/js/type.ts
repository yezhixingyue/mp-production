// import { IEquipmentBaseInfo } from '@/views/ProductionClient/assets/js/types';
import { ChunkStatusEnum } from './enum';

export interface IManageChunkInfo {
  /** ID */
  ID: string
  /** 块ID */
  ChunkID: string
  /** 块编号 */
  ChunkCode: string
  /** 大版编号 */
  PlateCode: number
  /** 销售端名称 */
  ServerName: string
  /** 物料 */
  Material: string
  /** 尺寸规格 */
  Size: string
  /** 数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 生产线 */
  Line: string
  /** 当前所在机器位置  */
  // Equipment?: IEquipmentBaseInfo
  /** 当前位置 */
  Position: string
  /** 状态 */
  Status: ChunkStatusEnum
  /** 缩略图 前面 */
  FrontThumbil: string
  /** 缩略图 后面 */
  BackThumbil: string
  /** 拼版时间 */
  ImpositionTime: string
}
