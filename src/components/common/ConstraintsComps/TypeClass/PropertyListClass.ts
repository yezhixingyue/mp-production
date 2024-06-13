/* eslint-disable max-len */
import api from '@/api';
import { getNameByIDAndList } from '@/assets/js/utils';
import { localEnumValueIDType } from '@/assets/js/utils/getListByEnums';
import { ConstraintsItemClass } from '../ConditionSetupPanel/ConstraintsItemClass';
import {
  OperatorMpEnumList, PropertyDisplayTypeEnum, PropertyDisplayTypeMpEnumList, PropertyValueTypeEnum,
} from './enum';
import { Property, PropertyListItemType } from './Property';
import {
  IGetPropOptions, IGroupedPropertyListItem, IPropertyListItemTypeWithFixedTypeChildren, IPropertyObjectMember,
} from './types';

export class PropertyListClass {
  PropertyList: PropertyListItemType[] = []

  options: IGetPropOptions | null = null

  loaded = false

  async getPropertyList() {
    if (!this.options) return;
    const resp = await api.propertyApis.getPropertyList(this.options).catch(() => null);
    this.loaded = true;
    if (resp?.data?.isSuccess) {
      this.PropertyList = resp.data.Data || [];
    }
  }

  constructor({ options, PropertyList }: { options?: IGetPropOptions, PropertyList?: PropertyListItemType[] }) {
    if (PropertyList) {
      this.PropertyList = [...PropertyList];
      this.loaded = true;
    } else if (options) {
      this.options = { ...options };
      this.getPropertyList();
    }
  }

  static getGroupedPropertyListData(PropertyList: PropertyListItemType[]) { // 获取分组数据 - 用于弹窗选择展示
    return this.getListGroupByType(PropertyList);
  }

  private static getListGroupByType(PropertyList: PropertyListItemType[]): IGroupedPropertyListItem[] { // { Type: { ID, Name }, PropertyList: [] } 按类型对属性列表进行分组
    const formatTypePropertyList = (PropertyList: PropertyListItemType[], ID: localEnumValueIDType) => {
      const arr = PropertyList.filter(p => p.Type === ID);
      const _list: IPropertyListItemTypeWithFixedTypeChildren[] = arr.filter(it => typeof it.FixedType !== 'number');

      let target: undefined | IPropertyListItemTypeWithFixedTypeChildren;

      arr.filter(it => typeof it.FixedType === 'number').forEach(prop => {
        target = undefined;
        let key: keyof Property | '' = '';
        switch (ID) {
          case PropertyDisplayTypeEnum.Attribute:
            // 稍后看情况
            key = 'Property';
            break;

          case PropertyDisplayTypeEnum.Material:
            // 物料类型 --- 暂不合并
            // key = 'MaterialType';
            break;

          case PropertyDisplayTypeEnum.Numberic:
            // 数值(辅助信息)类型
            key = 'Assist';

            break;
          default:
            break;
        }
        if (key) {
          target = _list.find(it => {
            const left = it[key] as IPropertyObjectMember | null;
            const right = prop[key] as IPropertyObjectMember | null;
            return left && right && left.ID === right.ID;
          });
          if (!target && prop[key]) {
            target = new Property({ [key]: { ...prop[key] }, Type: ID });
            _list.push(target);
          }
          if (target) {
            if (!target._FixedTypeList) target._FixedTypeList = [];
            target._FixedTypeList.push(prop);
          }
        } else {
          _list.push(prop);
        }
      });

      return _list;
    };

    const list = PropertyDisplayTypeMpEnumList.map(it => ({
      ...it,
      PropertyList: formatTypePropertyList(PropertyList, it.ID), // 后续可再继续细分
    })).filter(it => it.PropertyList.length > 0);

    return list;
  }

  /**
   * 从列表中去匹配到完整信息的属性
   *
   * @static
   * @param {Partial<PropertyListItemType>} imperfectProp
   * @param {PropertyListItemType[]} PropertyList
   * @returns
   * @memberof PropertyListClass
   */
  static getPerfectPropertyByImperfectProperty(imperfectProp: Partial<PropertyListItemType> | null, PropertyList: PropertyListItemType[]) {
    if (!imperfectProp || !PropertyList || !Array.isArray(PropertyList) || PropertyList.length === 0) return null;
    const t = PropertyList.find(it => {
      const {
        MaterialType, FixedType, Type, Property, Assist,
      } = it;
      if (!((!MaterialType && MaterialType === imperfectProp.MaterialType) || (MaterialType && imperfectProp.MaterialType && MaterialType.ID === imperfectProp.MaterialType.ID))) return false;
      if (!((!Property && Property === imperfectProp.Property) || (Property && imperfectProp.Property && Property.ID === imperfectProp.Property.ID))) return false;
      if (!((!Assist && Assist === imperfectProp.Assist) || (Assist && imperfectProp.Assist && Assist.ID === imperfectProp.Assist.ID))) return false;
      if (FixedType !== imperfectProp.FixedType) return false;
      if (Type !== imperfectProp.Type) return false;
      return true;
    });
    if (t) {
      // if (t.FixedType === 255) { // 常量
      //   const { DefaultValue } = imperfectProp;
      //   return { ...t, DefaultValue };
      // }
      // if (t.Type === 9) {
      //   const { CraftOptionList } = imperfectProp;
      //   if (CraftOptionList && t.CraftOptionList) {
      //     const list = t.CraftOptionList.map(it => {
      //       const _t = CraftOptionList.find(_it => _it.ID === it.ID && JSON.stringify(_it.Part) === JSON.stringify(it.Part));
      //       return _t ? { ..._t, Name: it.Name } : it;
      //     });
      //     return { ...t, CraftOptionList: list };
      //   }
      // }
      return t;
    }
    return null;
  }

  static getPropertyConditionText(list: ConstraintsItemClass[]) {
    if (!list || !Array.isArray(list) || list.length === 0) return '空';
    const _list = list.map(it => {
      const { Property, Operator, ValueList } = it;
      if (!Property) return null;
      let _operator = getNameByIDAndList(Operator, OperatorMpEnumList); // 获取到关系类型名称
      const {
        DisplayContent, OptionList, ValueType, Unit,
      } = Property;
      if (ValueType === PropertyValueTypeEnum.radio) _operator += '下面任一选项时：';
      if (ValueType === PropertyValueTypeEnum.multiple) {
        _operator += '下面所有选项时：';
      }
      const _name = DisplayContent ? DisplayContent.replace(/\[|\]/g, '') : '';
      let _val: string | number = '';
      if (ValueList) {
        if (ValueList.length === 1) {
          if ((ValueList[0].Value || ValueList[0].Value === 0)) {
            if (!Number.isNaN(+ValueList[0].Value)) {
              _val = ValueList[0].Value;
              if (Property.DisplayContent && Array.isArray(OptionList)) {
                const t = OptionList.find(_it => _it.First === _val);
                if (t) _val = t.Second;
              }
              if (_val && Unit) {
                _val += Unit;
              }
            }
          }
        }
        if (!_val && OptionList) {
          _val = ValueList.map(_it => OptionList.find(option => option.First === _it.Value)).filter(_it => _it).map(_it => _it?.Second).join('、');
        }
      }
      return {
        name: _name,
        operator: _operator,
        val: _val,
      };
    }).filter(it => it);

    return _list as { name: string; operator: string; val: string | number; }[];
  }
}
