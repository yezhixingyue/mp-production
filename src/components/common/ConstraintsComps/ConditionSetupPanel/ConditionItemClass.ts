import { PropertyListItemType } from '../TypeClass/Property';
import { Constraints } from './Constraints';

export class ConditionItemClass {
  ID: number | '' = ''

  Constraint: null | Constraints = null

  constructor(data: ConditionItemClass | null, PropertyList: PropertyListItemType[]) {
    if (data) {
      this.ID = data.ID || '';
    }
    this.ID = data && data.ID ? data.ID : '';
    this.Constraint = new Constraints(data?.Constraint || null, PropertyList);
  }
}
