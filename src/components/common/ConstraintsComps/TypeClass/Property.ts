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

  Property: null | IPropertyObjectMember = {
    ID: '',
    Name: '',
  }

  Assist: null | IPropertyObjectMember = {
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

  MaterialType: null | IPropertyObjectMember = { // 所属物料类型 后面可能会添加多种其它类型
    ID: '',
    Name: '',
  }

  constructor(data) {
    if (data) restoreInitDataByOrigin(this, data);
  }

  // eslint-disable-next-line no-use-before-define
  static getPropertyName(it: PropertyListItemType) {
    let name = '';
    switch (it.Type) {
      case PropertyDisplayTypeEnum.Attribute:
        name = it.Property?.Name || '';
        break;
      case PropertyDisplayTypeEnum.Numberic:
        name = it.Assist?.Name || '';
        break;
      case PropertyDisplayTypeEnum.Material:
        name = it.MaterialType?.Name || '';
        break;
      default:
        break;
    }
    if ((!name || typeof it.FixedType === 'number') && it.DisplayContent) {
      name = it.DisplayContent.replace('[', '').replace(']', '');
    }
    return name;
  }
}

export type PropertyListItemType = Omit<Property, 'getPropertyName'>;
