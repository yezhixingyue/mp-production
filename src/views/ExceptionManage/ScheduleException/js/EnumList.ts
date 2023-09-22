import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { SchedulingExceptionTypeEnum } from './enum';

/** 排程异常类型 */
export const SchedulingExceptionTypeEnumObj = {
  Order: {
    ID: SchedulingExceptionTypeEnum.Order,
    Name: '订单',
  },
  Plate: {
    ID: SchedulingExceptionTypeEnum.Plate,
    Name: '大版',
  },
};

/** 异常处理状态枚举列表 */
export const SchedulingExceptionTypeEnumList = getEnumList(SchedulingExceptionTypeEnumObj);
