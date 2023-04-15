import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { EquipmentGroupTypeClass } from '.';

/** 叼口类型枚举 */
export enum GripperTypeEnum {
    /** 无 */
    empty = 0,
    /** 后折页叼口 */
    behind = 2,
    /** 前折页叼口 */
    front = 1,
}

/** 叼口类型枚举对象 */
export const GripperTypeEnumObj = {
  empty: {
    ID: GripperTypeEnum.empty,
    Name: '无',
  },
  behind: {
    ID: GripperTypeEnum.behind,
    Name: '后折页叼口',
  },
  front: {
    ID: GripperTypeEnum.front,
    Name: '前折页叼口',
  },
};

/** 叼口类型枚举列表 */
export const GripperTypeEnumList = getEnumList(GripperTypeEnumObj);

/**
 * 设备组 - 叼口设置类
 *
 * @export
 * @class GripperSetupClass
 */
export class GripperSetupClass {
  ID = ''

  /** 叼口空白类型 */
  BiteMouthType = GripperTypeEnum.empty

  /** 叼口空白尺寸 */
  BiteMouthSize: number | '' = ''

  constructor(data: EquipmentGroupTypeClass['curEditItem']) {
    if (data) {
      this.ID = data.ID;
      this.BiteMouthType = data.BiteMouthType;
      if (data.BiteMouthSize) this.BiteMouthSize = data.BiteMouthSize;
    }
  }

  _validate(this: GripperSetupClass): string { // 限制this指向 -- 添加此方法仅为告诉ts
    if (typeof this.BiteMouthType !== 'number') {
      return '叼口类型不能为空';
    }

    if (this.BiteMouthType !== GripperTypeEnum.empty) {
      if (this.BiteMouthSize === '') {
        return '叼口尺寸不能为空';
      }
      if (!/^\d+$/.test(`${this.BiteMouthSize}`) || this.BiteMouthSize <= 0) {
        return '叼口尺寸必须为大于0的整数类型';
      }
    }

    return '';
  }
}
