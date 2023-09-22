import { IBaseProperty } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { SchedulingExceptionTypeEnum } from './enum';

/** 排程异常列表条目数据类型 */
export interface ISchedulingExceptionListItem {
  ID: number
  /** 排程异常类型 */
  Type: SchedulingExceptionTypeEnum
  /** 对象编号 */
  Code: string
  /** 内容 */
  Content: string
  /** 处理时间 */
  DealTime: string
  /** 处理人 */
  Operator: IBaseProperty<string>
  /** 创建时间 */
  CreateTime: string
}
