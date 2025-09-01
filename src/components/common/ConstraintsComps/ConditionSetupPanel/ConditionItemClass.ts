import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { PropertyListItemType } from '../TypeClass/Property';
import { Constraints } from './Constraints';

export class ConditionItemClass {
  ID: number | string = ''

  Priority: number | '' = ''

  Constraint: null | Constraints = null

  constructor(data: ConditionItemClass | null, PropertyList: PropertyListItemType[]) {
    if (data) restoreInitDataByOrigin(this, data);
    this.ID = data && data.ID ? data.ID : '';
    this.Constraint = new Constraints(data?.Constraint || null, PropertyList);
  }
}
