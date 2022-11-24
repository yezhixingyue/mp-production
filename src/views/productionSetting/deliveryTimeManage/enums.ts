import { getEnumList } from '@/assets/js/utils/getListByEnums';

export enum ShiftTypeEnum {
  /** 每天 */
  everyday = 0,
  /** 每周 */
  weekly = 1,
  /** 每月 */
  monthly = 2,
}

export const ShiftTypeEnumObj = {
  everyday: {
    ID: ShiftTypeEnum.everyday,
    Name: '每天',
  },
  weekly: {
    ID: ShiftTypeEnum.weekly,
    Name: '每周',
  },
  monthly: {
    ID: ShiftTypeEnum.monthly,
    Name: '每月',
  },
};

export const ShiftTypeEnumList = getEnumList(ShiftTypeEnumObj);
