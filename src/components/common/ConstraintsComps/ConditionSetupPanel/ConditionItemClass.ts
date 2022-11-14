import { PropertyListItemType } from '../TypeClass/Property';
import { Constraints } from './Constraints';

interface ITemp {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export class ConditionItemClass implements ITemp {
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
