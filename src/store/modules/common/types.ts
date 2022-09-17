import { IDistrictItem } from '@/assets/Types/common';

export interface IDistrictTreeListItemType extends IDistrictItem {
  children?: IDistrictTreeListItemType[]
}
