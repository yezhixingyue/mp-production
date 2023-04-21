import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { CalculateTypeEnum } from './enum';

const CalculateTypeEnumObj = {
  UnitOutput: {
    ID: CalculateTypeEnum.UnitOutput,
    Name: '单位产量',
  },
  FixedTime: {
    ID: CalculateTypeEnum.FixedTime,
    Name: '固定时长',
  },
};

/** 产能设置类型枚举列表 */
export const CalculateTypeEnumList = getEnumList(CalculateTypeEnumObj);
