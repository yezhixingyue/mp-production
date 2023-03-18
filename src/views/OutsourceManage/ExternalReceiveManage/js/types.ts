import { IEquipmentBaseInfo } from '@/views/ProductionClient/assets/js/types';
import { ExternalReportResultCodeEnum } from './enums';

/**
 * 外协入库报工结果类型
 *
 * @export
 * @interface IExternalReportResult
 */
export interface IExternalReportResult {
  /** 报工结果码 */
  Code: ExternalReportResultCodeEnum,
  /** 报工信息 */
  Message: string
  /** 任务ID */
  TaskID: string
  /** 任务编号 */
  TaskCode: number
  /** 工厂信息 */
  Equipment: IEquipmentBaseInfo
  /** 工序名称 */
  WorkingName: string
  /** 加工内容 */
  ProcessContent: string
  /** 数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 金额（元） */
  Amount: number
  /** 预计完工时间 */
  WishFinishedTime: string
  /** 异常信息 */
  Exception: string
}
