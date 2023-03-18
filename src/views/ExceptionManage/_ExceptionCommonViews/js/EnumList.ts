import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { ExceptionHandlerStatusEnum } from './enum';

/** 异常处理状态 */
export const ExceptionHandlerStatusEnumObj = {
  NotArrived: {
    ID: ExceptionHandlerStatusEnum.unprocessed,
    Name: '未处理',
  },
  HaveArrived: {
    ID: ExceptionHandlerStatusEnum.processed,
    Name: '已处理',
  },
};

/** 异常处理状态枚举列表 */
export const ExceptionHandlerStatusEnumList = getEnumList(ExceptionHandlerStatusEnumObj);
