import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { SchedulingExceptionTypeEnum } from './enum';

export class Condition {
  Type: SchedulingExceptionTypeEnum | '' = ''

  CreateTime = {
    First: '',
    Second: '',
  }

  DateType = 'today'

  KeyWords = ''

  /** 是否已处理 */
  HaveDeal: boolean | '' = ''

  Page = 1

  PageSize = 20

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
