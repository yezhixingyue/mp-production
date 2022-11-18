import { localEnumValueIDType } from '@/assets/js/utils/getListByEnums';
import { UseModuleEnum } from './enum';
import { PropertyListItemType } from './Property';

export interface IGetPropOptions {
  UseModule: UseModuleEnum
}

export interface IPropertyObjectMember {
  ID: string
  Name: string,
}

export interface IPropertyValueRange {
  MinValue: number,
  MaxValue: number,
}

export interface IPropertyOptionListItem {
  First: string | number,
  Second: string
}

export interface IPropertyListItemTypeWithFixedTypeChildren extends PropertyListItemType {
  _FixedTypeList?: PropertyListItemType[]
}

export interface IGroupedPropertyListItem {
  ID: localEnumValueIDType,
  Name: string,
  PropertyList: IPropertyListItemTypeWithFixedTypeChildren[], // 后面可能会修改
}

export interface IValueListItem {
  Value: string | number
}
