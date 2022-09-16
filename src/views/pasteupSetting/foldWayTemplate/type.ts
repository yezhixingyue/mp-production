export interface PositionListType{
  RowValue: number,
  ColumnValue: number,
  PageNumber: number,
  ShowType: number,
}
export interface FoldWayTemplateType {
  ClassID: number | string,
  RowNumber: number | string,
  ColumnNumber: number | string,
  PositionList: PositionListType[],
  CreateTime: string,
  ID: string,
  Name: string,
}
