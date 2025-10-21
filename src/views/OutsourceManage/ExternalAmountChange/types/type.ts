import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { TaskPriceCheckStatusEnum } from './enum';
import { getTableDataList } from '../tools';

/** 外协金额修改条目 */
export interface ITaskPriceCheckInfo {
  ID: number;
  Status: TaskPriceCheckStatusEnum;
  TaskDetail: ITaskDetail;
  /** 外协金额 */
  OutPrice: number;
  /** 修改后金额 */
  ChangePrice: number | null
  /** 修改说明 */
  ChangeRemark: string
  /** 外协主管 */
  ManagerName: string
  /** 外协主管id */
  ManagerID: string
  /** 参考金额 */
  ReferencePrice: number
  /** 财务复核人 */
  RecheckOperatorName: string
  /** 财务复核意见 */
  RecheckRemark: string
  /** 财务复核时间 */
  RecheckTimer: string
  /** 创建时间 */
  CreateTime: string
  /** 创建人 */
  CreatorID: string
  CreatorName: string
  /** 是否是主管驳回 */
  IsManagerRefuse: boolean
}

/** 外协金额修改表格数据类型 */
export type TaskPriceCheckInfoRowType = ReturnType<typeof getTableDataList>[number];

export type MenuEventType = 'changePrice' | 'check' | 'confirm' | 'delete';
