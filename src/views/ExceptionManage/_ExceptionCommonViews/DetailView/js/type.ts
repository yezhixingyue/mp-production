import { IBaseProperty } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { IExceptionPlate, IExceptionUnionLine, ITaskExceptionDetail } from '../../js/type';
import { SolveTypeEnum } from '../../SetupView/js/enum';
import { IRevocationDetail, ITaskExceptionExternalFactory } from '../../SetupView/js/type';

export interface IRedoDetail {
  UnionLine: IExceptionUnionLine
  PlateList: IExceptionPlate[]
}

interface ITaskExceptionHandling {
  /** 异常ID */
  ID: string
  /** 处理方式 = ['0', '1', '2'] */
  SolveType: SolveTypeEnum
  /** 撤销信息 */
  RevocationInfo: IRevocationDetail
  /** 重做信息 */
  RedoInfo: IRedoDetail
  /** 外协处理 */
  ExternalFactory: ITaskExceptionExternalFactory
  /** 提交人 */
  Operator: IBaseProperty<string>
  /** 处理时间 */
  CreateTime: string
}

export interface ITaskExceptionHandlingDetail extends Omit<ITaskExceptionDetail, 'PlateList' | 'UnionLine'> {
  /** 处理详情信息 */
  HandlingDetail: ITaskExceptionHandling
}
