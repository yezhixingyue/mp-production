import { IBaseProperty } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';

/** 印前分配权限列表条目 */
export interface IAdjustPermissionInfo {
  /** 员工ID */
  ID: string
  /** 员工名称 */
  Name: string
  /** 拥有权限的生产线列表 */
  LineList: IBaseProperty<string>[]
}

/** 印前调整： 提前入尾版 | 追加印数 列表条目接口类型 */
export interface IAdjustInfo {
  ID: string
  /** 订单编号 */
  OrderCode: string
  /** 款数描述 */
  KindRemark: string
  /** 数量 */
  Number: number
  /** 未拼版数量 */
  RemainNumber: number
  /** 追加数量 */
  AddNumber: number
  /** 拼版等级 */
  ImpositionLevel: number
  /** 大版ID */
  PlateID: string
  /** 工厂创建时间 */
  FactoryCreateTime: string
  /** 最迟拼版时间 */
  LastImpositionTime: string
  /** 描述 */
  Remark: string
  /** 登记时数量 */
  CurrentNumber: number | null
  /** 登记人ID */
  OperatorID: string
  /** 登记人名称 */
  OperatorName: string
  /** 登记时间 */
  CreateTime: string
  /** 生产线ID */
  LineID: string
}

export interface IPlateChunk {
  ID: string
  /** 半成品 */
  SemiFinished: string
  /** 页码描述 */
  PageRemark: string
  /** 款数描述 */
  KindRemark: string
  /** 计划大版ID */
  PlateID: string
  /** 总数量 */
  TotalNumber: number
  /** 剩余数量 */
  RemainNumber: number
}
