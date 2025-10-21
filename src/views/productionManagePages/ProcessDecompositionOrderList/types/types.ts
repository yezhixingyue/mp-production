import { RemoveFuncProperties, RemoveUnderlinePrivateProperties } from '@/types/types';
import { IOrderItemBase } from '../../ManageOrderListPage/js/type';
import { IImpositionTemplate, ILineWorkingNoteInfo } from '../../ManualOrderHandlerPage/js/ProductionLineDetailTypes';
import { IBaseProperty, IPrintColor } from '../../ManualOrderHandlerPage/js/types';
import { PDOLineInstance } from '../childrenPages/PDOSetupView/model/Instance';
import { SignaturePositionEnum, CraftSolveStepEnum, PDOStatusEnum } from './enum';

export interface IPDOrderItem extends IOrderItemBase {
  /** 生产线 */
  LineList: string[]
  /** 状态 */
  Status: PDOStatusEnum
  /** 文件列表 */
  FileList: { ID: string; FilePath: string; PartName?: string; FileName: string; PageNumber: number; Width: number; Height: number }[]
  /** 操作人 */
  Operator: string
  /** 是否拥有详情数据 */
  HaveDetail: boolean
  /** 付款时间 */
  PayTime: string
  /** 价格 */
  Fund: {
    FinalPrice: number
  }
  /** 地址配送信息 */
  Address?: {
    ExpressText: string
  }
}

/** 订单分解详情数据 */
export interface IPDOrderCraftResolveDetail {
  Operator: string
}

export interface IPDOrderReqParams {
  SellOrderID: string
  InstanceList: []
}

/**
 * 生产实例 - 文件列表
 *
 */
export interface IOrderFileInfo {
  /** 文件唯一名 --- 文件新上传 */
  UniqueName: string
  /** 适用辅助文件列表 [单个辅助文件id] */
  AssistList?: ILineWorkingNoteInfo[]
  FileName: string
  /** 编辑时返回的文件路径 */
  FilePath?: string
  /** 新匹配到的路径 */
  DownloadPath?: string
  /** 存放辅助文件信息 仅辅助文件有 */
  _NoteInfo?: ILineWorkingNoteInfo
  /** 拼版模版id */
  Template?: IImpositionTemplate | null
  /** 存放拼版模板信息 仅拼版文件有 */
  _PlateTemplate?: IImpositionTemplate
  /** 专色列表 [单个颜色id] */
  ColorList?: string[]
  /** 存放专色信息 仅专色文件有 */
  _SpecialColorInfo?: IPrintColor
  _File: null | File
  /** 生产线信息 */
  _Line: {
    ID: string,
    Name: string,
  }
  ID?: string
  BleedTop?: '' | number
  BleedBottom?: '' | number
  BleedLeft?: '' | number
  BleedRight?: '' | number
  /** 装订边 */
  BindingEdge: SignaturePositionEnum
}

/** 生产线实例属性接口类型 */
export interface IInstanceAttribute {
  Material: {
    ID: string
    Name: string
    TypeID: string
    TypeName: string
  }
}

/** 工艺分解保存 - 生产线实例详情数据类型 */
export type TDetailInstance = RemoveFuncProperties<RemoveUnderlinePrivateProperties<Omit<PDOLineInstance, 'WorkingList' | 'FileList'>>> & {
  WorkingList: { WorkingID: string; WorkingName: string; WorkTimes: number; AssistList?: {Content:string;Name:string}[] }[]
  FileList: (RemoveUnderlinePrivateProperties<Omit<PDOLineInstance['FileList'][number], 'Template'>> & {
    Template?: IImpositionTemplate
    Width: number
    Height: number
    PageNumber: number
  })[]
  Attribute?: IInstanceAttribute
}

/** 工艺分解保存详情 */
export type TCraftResolveDetail = {
  ID: string
  CraftResolve: {
    Step: CraftSolveStepEnum
    ColorList?: IBaseProperty<string>[]
  }
  InstanceList: TDetailInstance[]
} & Pick<TDetailInstance, 'LineList' | 'AssistList' | 'WorkingList' | 'FileList'>
