import { ReportModeEnum } from '@/views/productionSetting/process/enums';

/**
 * 生产管理 - 生产任务列表条目类型
 *
 * @export
 * @interface IManageTaskListItem
 */
export interface IManageTaskListItem {
  /** 任务ID */
  ID: string
  /** 任务编号 */
  Code: number
  /** 报工方式 */
  Type: ReportModeEnum
  /** 关联ID */
  RelationID: string
  /** 操作次序 */
  Index: number
  /** 内容 */
  Content: string
  /** 物料 */
  Material: string
  /** 数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 加工信息 */
  ProcessInformation: string
  /** 设备 */
  Equipment: string
  /** 操作人 */
  Operator: string
  /** 预计加工时长 */
  WishDuration: number
  /** 实际加工时长 */
  ActualDuration: number
  /** 完工时间 */
  FinishTime: string
}
