import { PropertyListItemType } from '../TypeClass/Property';
import { Constraints } from './Constraints';

export class ConditionItemClass {
  ID: number | '' = ''

  LineEquipmentID = ''

  Priority = 0

  Value = 0

  Type = 0

  Constraint: null | Constraints = null

  constructor(data: ConditionItemClass | null, PropertyList: PropertyListItemType[]) {
    if (data) {
      this.ID = data.ID || '';
      this.LineEquipmentID = data.LineEquipmentID;
      this.Priority = data.Priority;
      this.Value = data.Value;
      this.Type = data.Type;
    }
    this.ID = data && data.ID ? data.ID : '';
    this.Constraint = new Constraints(data?.Constraint || null, PropertyList);
  }
}
