import { localEnumValueIDType } from '@/assets/js/utils/getListByEnums';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { PropertyValueTypeEnum } from '../TypeClass/enum';
import { PropertyListItemType } from '../TypeClass/Property';
import { PropertyListClass } from '../TypeClass/PropertyListClass';
import { IValueListItem } from '../TypeClass/types';

export class ConstraintsItemClass {
  ConstraintID = ''

  Property: PropertyListItemType | null = null

  Operator: localEnumValueIDType = ''

  ValueList: IValueListItem[] = []

  _key = Math.random().toString(16).slice(-10)

  _errMsg = ''

  constructor(data: { origin?: ConstraintsItemClass | null, prop?: PropertyListItemType, PropertyList?: PropertyListItemType[] } | null = null) {
    if (data) {
      const { origin, prop, PropertyList } = data;
      if (origin) {
        // 编辑还原
        this.ConstraintID = origin.ConstraintID;
        this.Property = origin._key && origin.Property?.DisplayContent
          ? origin.Property : PropertyListClass.getPerfectPropertyByImperfectProperty(origin.Property, PropertyList || []); // 此处寻找？
        this.Operator = origin.Operator;
        this.ValueList = origin.ValueList.map(it => ({ Value: it.Value }));
      } else if (prop) { // 新增
        this.Property = prop;
        // 初始化Operator和ValueList ?
        if (prop.OperatorList && prop.OperatorList.length > 0) {
          [this.Operator] = prop.OperatorList;
        }
      }
    }
  }

  validate() {
    this._errMsg = '';

    let msg = '';
    // 1. 非空判断
    if (this.ValueList.length === 0 || (this.ValueList.length === 1 && !this.ValueList[0].Value && this.ValueList[0].Value !== 0)) {
      msg = '未设置属性值';
    }

    // 2. 数值范围判断
    if (!msg && this.Property?.ValueType === PropertyValueTypeEnum.numerical && this.Property.ValueRange) {
      const { MinValue, MaxValue } = this.Property.ValueRange;
      const val = this.ValueList[0].Value; // 后面添加数值类型判断
      if (Number.isNaN(+val)) {
        msg = '必须为数值类型';
      } else {
        if ((MinValue || MinValue === 0) && +val < MinValue) {
          msg = `值不能小于${MinValue}`;
        }
        if ((MaxValue || MaxValue === 0) && +val > MaxValue && MaxValue !== -1) {
          if (msg) msg += '；';
          msg += `值不能大于${MaxValue}`;
        }
      }
    }

    // 最终处理
    if (msg) {
      const cb = () => {
        this._errMsg = msg;
      };
      MpMessage.error({
        title: '保存失败', msg: `${this.Property?.DisplayContent} ${msg}`, onOk: cb, onCancel: cb,
      });
      return false;
    }
    return true;
  }
}

export type ConstraintsItemType = Omit<ConstraintsItemClass, '_key' | '_errMsg' | 'validate'>;
