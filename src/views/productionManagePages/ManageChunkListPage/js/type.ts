import { IBaseProperty } from '../../ManualOrderHandlerPage/js/types';
import { ChunkStatusEnum } from './enum';

export interface IManageChunkInfo {
  ID: string
  /** 块ID */
  ChunkID: string
  /** 块编号 */
  ChunkCode: string
  /** 大版编号 */
  PlateCode: number
  /** 销售端 */
  Server: IBaseProperty<number>
  /** 物料 */
  Material: string
  /** 尺寸规格 */
  Size: string
  /** 数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 生产线 */
  ProductionLine: string
  /** 当前所在机器位置  */
  Equipment: string
  /** 状态 */
  Status: ChunkStatusEnum
}
