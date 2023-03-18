import { IBaseProperty } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import {
  IExceptionChunk, IExceptionPlate, IExceptionUnionLine, IExceptionTaskPlateInfo,
} from '../../js/type';
import {
  ExternalErrorLimitTypeEnum, RevocationTypeEnum, SolveTypeEnum,
} from './enum';
import { HandleExceptionRuleForm } from './HandleExceptionRuleForm';
import { IExceptionPlate4Form, IRedoInfo4RuleForm } from './ruleFormType';

export interface ITargetOrder {
  /** 订单ID */
  ID: string
  /** 销售端名称 */
  ServerName: string
  /** 订单编号 */
  OrderID: string
  /** 订单内容 */
  Content: string
  /** 产品一级分类 */
  FirstLevel: string
  /** 产品二级分类 */
  SecondLevel: string
  /** 产品信息 */
  Product: string
  /** 数量 */
  Number: number
  /** 产品单位 */
  Unit: string
  /** 尺寸 */
  Size: string
  /** 预计生产完成时间 */
  ProduceEndTime: string
}

/** 撤销其他块：通过大版ID和订单ID查询到的块列表数据 */
export interface IRevocationChunk extends Omit<IExceptionChunk, 'WorkingList'> {
  Plate?: IExceptionTaskPlateInfo | null
  Order?: ITargetOrder
}

/** 异常处理提交 - 撤销信息提交类型 */
export interface IRevocationDetail {
  /** 撤销此订单时，是否全选了块列表 */
  IsAllSelected: boolean
  Type: RevocationTypeEnum | ''
  PlateList: IExceptionTaskPlateInfo[]
  ChunkList: IRevocationChunk[]
}

/** 要重做的工序信息传递类型 */
interface IRedoWorking {
  /** 工序ID */
  WorkingID: string
  /** 重新领料 */
  ReceiveMaterial: boolean
}

/** 异常处理提交 - 重做信息提交类型 */
export interface IRedoHandling {
  // /** 对象类型 = ['0', '1', '2', '3'], */
  // TargetType: TargetTypeEnum
  /** 对象ID */
  TargetID: string
  /** 重做工序列表 */
  WorkingList: IRedoWorking,
}

/** 外协处理 */
export interface ITaskExceptionExternalFactory {
  /** 减款金额 */
  ReduceAmount: number
  /** 限制类型 */
  LimitType: ExternalErrorLimitTypeEnum
  /** 工厂 */
  Factory: IBaseProperty<string>
  /** 锁定金额 */
  FixedAmount: number
  /** 修改加工信息 */
  ProcessContent: string
}

interface IRedoInfo {
  /** 组合生产线信息 */
  UnionLine: IExceptionUnionLine
  /** 重做列表 */
  PlateList: IExceptionPlate[]
}

/**
 * 异常处理详情
 *
 * @export
 * @interface ITaskExceptionHandling
 */
export interface ITaskExceptionHandling {
  /** 异常ID */
  ID: string
  /** 处理方式 */
  SolveType: SolveTypeEnum
  /** 撤销信息 */
  RevocationInfo: IRevocationDetail
  /** 重做信息 */
  RedoInfo: IRedoInfo
  /** 外协处理 */
  ExternalFactory: ITaskExceptionExternalFactory
  /** 提交人 */
  Operator: IBaseProperty<string>
  /** 处理时间 */
  CreateTime: string
}

interface IRedoInfo4Submit extends Omit<IRedoInfo4RuleForm, 'PlateList'> {
  PlateList: Partial<IExceptionPlate4Form>[]
}

/** 指定大版勾选数据列表类型 */
export interface IRevocationPlateItem extends Omit<IExceptionTaskPlateInfo, 'ChildList'> {
  checked: boolean
  ChildList: IRevocationPlateItem[] | null
}

/** 异常处理数据提交类型 */
export interface IExceptionSubmitParams extends Partial<Omit<HandleExceptionRuleForm, 'RevocationInfo' | 'RedoInfo' | 'ExternalFactory'>> {
  RevocationInfo?: Partial<Omit<IRevocationDetail, 'PlateList'> & { PlateList: { ID: string }[] }>
  RedoInfo?: Partial<IRedoInfo4Submit> & { OrderID?: string }
  ExternalFactory?: Partial<HandleExceptionRuleForm['ExternalFactory']>
}
