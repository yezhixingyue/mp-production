export interface MaterialRelationAttributesType {
  AttributeID: string
  AttributeUnit: string
  InputSelectValue: string
  IsBrand: boolean
  NumericValue: number
  SelectID: string
  SelectValue: number|string
  Sort: number
}
export interface goodsPositionStockDetailsType {
  MaterialID: string
  MaterialRelationAttributes: MaterialRelationAttributesType[]
  Stock: number
  StockUnit: string
}
export interface ILocationMapOriginPointData {
  LeftTopX: number
  LeftTopY: number
  DimensionX: string
  DimensionY: string
}

export interface IUsePositionDetailsItem {
  PositionID: string
  PositionName: string
  PositionDetails: ILocationMapOriginPointData[]
  goodsPositionStockDetails?:goodsPositionStockDetailsType[]
}
interface DimensionType {
  Dimension:string
  DimensionNumber: number
}
export interface AllPositionDetailsType {
  DimensionXS: DimensionType[],
  DimensionYS: DimensionType[]
  DimensionUnitX: string
  DimensionUnitY: string
}
export interface ILocationMapOriginData {
  AllPositionDetails:AllPositionDetailsType
  UsePositionDetails: IUsePositionDetailsItem[]
  DyadicArrayDimensionData: ILocationMapOriginPointData[][]
}

export enum LocationColorEnums {
  strokeStyle = '#444',
  squareEmptyColor = '#fff',
  // 灰色
  squareFillColor = '#d7d7d7',
  // 黄色
  normal = '#F5A407',
  // 选中的红色
  isSetSelected = '#ff3769',
  // 与入库物料一致 蓝色
  identical = '#02a7f0',
  // 空货位 绿色
  vacancy = '#95f204',
}

export interface IPoint {
  x: number
  y: number
}

export enum pointDirection {
  top = 0,
  right = 1,
  bottom = 2,
  left = 3,
}

export interface IDialogRuleForm {
  PositionID: string,
  PositionName: string,
}

export enum MapConditionEnum {
  ctxLineWidth = 1,
  labelGapWidth = 50, // 左侧文字宽度
  labelGapHeight = 30, // 顶部文字高度
}
