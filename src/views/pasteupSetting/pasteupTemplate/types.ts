interface AreaList {
  XCoordinate: number|null|'',
  YCoordinate: number|null|'',
  Length: number|null|'',
  Width: number|null|'',
}
interface ModeItemList {
  XCoordinate: number|null|'',
  YCoordinate: number|null|'',
  Length: number|null|'',
  Width: number|null|'',
  RowNumber: number|null|'',
  ColumnNumber: number|null|'',
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
  BleedTop: number|null|'',
  BleedBottom: number|null|'',
  BleedLeft: number|null|'',
  BleedRight: number|null|'',
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
