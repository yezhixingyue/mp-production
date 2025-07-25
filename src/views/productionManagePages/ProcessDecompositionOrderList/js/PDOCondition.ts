import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { PDOStatusEnum } from '../types/enum';

/** 订单审核列表获取条件类 */
export class PDOCondition {
  ProductionLine = ''

  _ProductionLineType = ''

  Operator = ''

  Status: '' | PDOStatusEnum = ''

  CreateTime = {
    First: '',
    Second: '',
  }

  DateType = 'last7Date'
  // DateType = 'curMonth'

  KeyWords = ''

  Page = 1

  PageSize = 20

  filter() {
    /** 处理时间 */
    CommonClassType.setDate(this, 'CreateTime');

    /** 筛选结果 */
    return CommonClassType.filter(this);
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
