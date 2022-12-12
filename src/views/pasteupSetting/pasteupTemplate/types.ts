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
interface RangeType {
  MinValue: number|null|'',
  MaxValue: number|null|'',
}
export interface SizeListType{
  TemplateID: string,
  ReproductionType: number,
  SizeType: number,
  ModeSizeAttribute: ModeSizeAttribute | null,
  ActualSizeAttribute: ActualSizeAttribute | null,
  LengthErrorRange: RangeType | null,
  WidthErrorRange: RangeType | null,
  CreateTime: string,
  ID: string,
  Name: string,
}

export interface ImpositionTemmplate{
  CreateTime?: string,
  ID: string,
  Name: string,
  IsPrintingPlate:boolean,
  IsSameSizeWithPrintingPlate:boolean,
  List:SizeListType[],
}
