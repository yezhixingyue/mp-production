import { Square } from './Square';
import { LocationColorEnums } from './types';

export class LocationSetClass {
  PositionID: number | '' = ''

  PositionName = ''

  color: LocationColorEnums = LocationColorEnums.normal

  squares: Square[] = []

  constructor(PositionID, PositionName, status, points) {
    this.PositionID = PositionID;
    this.PositionName = PositionName;
    this.color = status;
    this.squares = points;
  }
}
