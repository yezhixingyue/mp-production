import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { TaskPriceCheckStatusEnum } from '../types/enum';

export class Condition {
  /** 外协工厂 */
  Factory = ''

  /** 外协操作人 */
  SendOperator = ''

  Status: '' | TaskPriceCheckStatusEnum = ''

  /** 外协时间 */
  SendTime = {
    First: '',
    Second: '',
  }

  DateType = 'all'

  /** 外协主管 */
  Manager = ''

  /** 财务复核人 */
  RecheckOperator = ''

  Page = 1

  PageSize = 20

  KeyWords = ''

  filter() {
    /** 处理时间 */
    CommonClassType.setDate(this, 'SendTime');

    /** 筛选结果 */
    return CommonClassType.filter(this, true);
  }

  setCondition(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
