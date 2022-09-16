interface AreaList {
  XCoordinate: number|'',
  YCoordinate: number|'',
  Length: number|'',
  Width: number|'',
}
interface ModeItemList {
  XCoordinate: number|'',
  YCoordinate: number|'',
  Length: number|'',
  Width: number|'',
  RowNumber: number|'',
  ColumnNumber: number|'',
  key: string,
}
interface PlateInfo {
  FilePath: string,
  Length: number,
  Width: number,
  AreaList: AreaList[],
}
interface ModeSizeAttribute {
  PlateInfo: PlateInfo
  // 是否按模位
  UseMode: boolean,
  ModeItemList: ModeItemList[],
}
interface ActualSizeAttribute {
  BleedTop: number|'',
  BleedBottom: number|'',
  BleedLeft: number|'',
  BleedRight: number|'',
}
export interface ImpositionTemmplate{
  ClassID: number | string,
  // 印刷版
  IsPrintingPlate: boolean,
  // 和印刷版保持一致
  IsSameSizeWithPrintingPlate: boolean,
  // 翻版方式
  ReproductionType: number,
  // 尺寸
  SizeType: number,
  ModeSizeAttribute: ModeSizeAttribute,
  ActualSizeAttribute: ActualSizeAttribute,
  CreateTime: string,
  ID: string,
  Name: string,
}
