import { localEnumValueIDType } from '@/assets/js/utils/getListByEnums';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import {
  FixedTypeEnum, PropertyDisplayTypeEnum, PropertyValueTypeEnum, UseModuleEnum,
} from './enum';
import { IPropertyObjectMember, IPropertyOptionListItem, IPropertyValueRange } from './types';

export class Property {
  DisplayContent = ''

  FixedType: FixedTypeEnum | null = null

  UseModule: UseModuleEnum = UseModuleEnum.EquipmentGroupMaterialTypeLimit

  Property = {
    ID: '',
    Name: '',
  }

  OperatorList: localEnumValueIDType[] = []

  OptionList: null | IPropertyOptionListItem[] = null

  PositionID = ''

  StoredContent = ''

  Type: PropertyDisplayTypeEnum = PropertyDisplayTypeEnum.Attribute

  Unit = ''

  ValueRange: null | IPropertyValueRange = null

  ValueType: PropertyValueTypeEnum = PropertyValueTypeEnum.numerical

  MaterialType: null | IPropertyObjectMember = null // 所属物料类型 后面可能会添加多种其它类型

  constructor(data) {
    if (data) restoreInitDataByOrigin(this, data);
  }
}

export type PropertyListItemType = Omit<Property, ''>;
