import { SignaturePositionEnum } from '@/views/productionManagePages/ProcessDecompositionOrderList/types/enum';

export interface PositionListType{
  RowValue: number,
  ColumnValue: number,
  FrontPage: number,
  FrontRotate: boolean,
  BackPage: number,
  BackRotate:boolean
}
export interface FoldWayTemplateType {
  ClassID: number | string,
  RowNumber: number | string,
  ColumnNumber: number | string,
  PositionList: PositionListType[],
  CreateTime: string,
  ID: string,
  Name: string,
  /** 装订边所在位置 */
  BindingEdge: SignaturePositionEnum
  GripperEdge: SignaturePositionEnum
  GripperEdgeValue: number
}
