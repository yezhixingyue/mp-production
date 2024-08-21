import { ExceptionHandlerStatusEnum } from './enum';

/** 异常处理状态枚举列表 */
export const ExceptionHandlerStatusEnumList = [
  {
    ID: ExceptionHandlerStatusEnum.unprocessed,
    Name: '未处理',
  },
  {
    ID: ExceptionHandlerStatusEnum.processed,
    Name: '已处理',
  },
  {
    ID: ExceptionHandlerStatusEnum.canceled,
    Name: '已撤销',
    OutSourcingUsable: false, // 该状态外协不可用 - 目前仅影响到顶部页面筛选
  },
];
