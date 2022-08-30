export interface ILocationMapOriginPointData {
  LeftTopX: number
  LeftTopY: number
  DimensionX: string
  DimensionY: string
}

export interface IUsePositionDetailsItem {
  PositionID: number
  PositionName: string
  PositionDetails: ILocationMapOriginPointData[]
}

export interface ILocationMapOriginData {
  AllPositionDetails:ILocationMapOriginPointData[]
  UsePositionDetails: IUsePositionDetailsItem[]
}

export enum LocationColorEnums {
  strokeStyle = '#444',
  squareEmptyColor = '#fff',
  squareFillColor = '#d7d7d7',
  normal = '#F5A407',
  isSetSelected = '#ff3769'
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
  PositionID: number | '',
  PositionName: string,
}

export enum MapConditionEnum {
  ctxLineWidth = 1,
  labelGapWidth = 50, // 左侧文字宽度
  labelGapHeight = 30, // 顶部文字高度
}
