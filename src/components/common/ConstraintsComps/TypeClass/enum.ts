import { getEnumList } from '@/assets/js/utils/getListByEnums';

export enum PropertyDisplayTypeEnum {
  Attribute = 0, // 属性
  /** 数值 */
  Numberic = 1,
  /** 物料 */
  Material = 2,
  /** 其它 */
  Other = 3,
}

export const PropertyDisplayTypeMpEnums = {
  Attribute: {
    ID: PropertyDisplayTypeEnum.Attribute,
    Name: '属性',
  },
  Numberic: {
    ID: PropertyDisplayTypeEnum.Numberic,
    Name: '辅助信息',
  },
  Material: {
    ID: PropertyDisplayTypeEnum.Material,
    Name: '物料',
  },
  Other: {
    ID: PropertyDisplayTypeEnum.Other,
    Name: '其它',
  },
};

export const PropertyDisplayTypeMpEnumList = getEnumList(PropertyDisplayTypeMpEnums);

export enum UseModuleEnum {
  /** 获取设备组物料类型限制条件属性 */
  EquipmentGroupMaterialTypeLimit = 0, // 获取设备组物料类型限制条件属性
  /** 设置伸放条件 */
  PutOutLimit = 1,
  /** 设置产能条件 */
  CapacityLimit = 2,
  /** 设置产能计算数量 */
  CapacityNumber = 21,
  /** 全部 */
  all = 255
}

export enum FixedTypeEnum {
  CheckedNumber = 0, // 已选项数
  Sum = 1, // 和
  MinValue = 2, // 最小值
  MaxValue = 3, // 最大值
  UseTimes = 4, // 使用次数
  ShortestEdge = 5, // 最短边
  LongestEdge = 6, // 最长边
  GeneralSize = 7, // 常规尺寸
  Length = 8, // 长
  Width = 9, // 宽
  Option = 10, // 选项
  Const = 255, // 常数
}

export enum OperatorEnum {
  equal = 1, // 等于
  notEqual = 2, // 不等于
  greaterThan = 3, // 大于
  equalOrGreaterThan = 4, // 大于等于
  lessThan = 5, // 小于
  equalOrLessThan = 6, // 小于等于
  // contain = 7, // 包含
  // notContain = 8, // 不包含
  // checked = 9, // 选中
  // unchecked = 10, // 不选中
  // equalOrGreaterThanAndEqualOrLessThan = 11, // ≥值≤ 11
  // greaterThanAndEqualOrLessThan = 12, // ＞值≤ 12
  // equalOrGreaterThanAndLessThan = 13, // ≥值＜ 13
  // greaterThanAndLessThan = 14, // ＞值＜ 14
  // disabled = 21, // 禁用
  // hidden = 22, // 隐藏
  // required = 23, // 必选
}

export const OperatorMpEnums = {
  equal: {
    ID: OperatorEnum.equal,
    Name: '等于',
  },
  notEqual: {
    ID: OperatorEnum.notEqual,
    Name: '不等于',
  },
  greaterThan: {
    ID: OperatorEnum.greaterThan,
    Name: '大于',
  },
  equalOrGreaterThan: {
    ID: OperatorEnum.equalOrGreaterThan,
    Name: '大于等于',
  },
  lessThan: {
    ID: OperatorEnum.lessThan,
    Name: '小于',
  },
  equalOrLessThan: {
    ID: OperatorEnum.equalOrLessThan,
    Name: '小于等于',
  },
};

export const OperatorMpEnumList = getEnumList(OperatorMpEnums);

export enum PropertyValueTypeEnum { // 值类型
  numerical = 0, // 值
  radio = 1, // 值为单选类型
  multiple = 2, // 值可多选
}
