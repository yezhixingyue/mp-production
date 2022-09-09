import { Square } from './Square';
import { LocationColorEnums, goodsPositionStockDetailsType } from './types';

export class LocationSetClass {
  PositionID: number | '' = ''

  PositionName = ''

  color: LocationColorEnums = LocationColorEnums.normal

  squares: Square[] = []

  goodsPositionStockDetails: goodsPositionStockDetailsType[] = []

  LocationName = ''

  constructor(PositionID, PositionName, status, points, goodsPositionStockDetails, LocationName = '') {
    this.PositionID = PositionID;
    this.PositionName = PositionName;
    this.color = status;
    this.squares = points;
    this.goodsPositionStockDetails = goodsPositionStockDetails;
    this.LocationName = LocationName;
  }
}
