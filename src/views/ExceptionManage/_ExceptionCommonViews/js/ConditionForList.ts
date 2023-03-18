import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { ExceptionHandlerStatusEnum } from './enum';

export class ConditionForList {
  /** 是否外协异常 */
  IsOutSourcing = false

  /** 异常处理状态 */
  Status: '' | ExceptionHandlerStatusEnum = ''

  /** 处理人 */
  Operator = ''

  /** 提交时间 */
  CreateTime = {
    First: '',
    Second: '',
  }

  DateType = 'today'

  KeyWords = ''

  Page = 1

  PageSize = 20

  constructor(IsOutSourcing: boolean) { // 创建实例的时候需要知道该实例异常类型为生产异常还是外协异常
    this.IsOutSourcing = IsOutSourcing;
  }

  filter() {
    /** 处理时间 */
    CommonClassType.setDate(this, 'CreateTime', { First: 'First', Second: 'Second' });

    /** 筛选结果 */
    return CommonClassType.filter(this);
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
