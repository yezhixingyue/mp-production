import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { IGetPropOptions } from '@/components/common/ConstraintsComps/TypeClass/types';
import request from '../request/request';

export const propertyApis = {
  getPropertyList(data) {
    return request<IGetPropOptions, PropertyListItemType[]>({ method: 'POST', url: '/Api/Property/List', data });
  },
};
