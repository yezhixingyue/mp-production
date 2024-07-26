import { PrintSideEnum } from '../../ManualOrderHandlerPage/js/enums';

/** 数码完工任务列表 */
export interface IDigitalTask {
  Code: number
  /** 大版/订单ID */
  TargetCode: string
  /** 操作次序 */
  Index: string
  Material: string
  Working: string
  /** 加工信息 */
  WorkingNote: string
  /** 设备 */
  Equipment: string
  /** 印面 */
  PrintSide: PrintSideEnum
  /** 印面数/订单总量 */
  SideNumber: number
  /** 印张数/任务数量 */
  MaterialNumber: number
  /** 申放数量 */
  Wastage: number
  /** 操作人 */
  Operator: number
  /** 预计加工时长 */
  WishDuration: string
  /** 实际加工时长 */
  ActualDuration: string
  /** 完工时间 */
  FinishTime: string
  /** 订单总量单位 - 仅订单报工 订单总量 任务数量 申放数量 使用 */
  Unit: string
}
