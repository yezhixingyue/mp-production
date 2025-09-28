import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';

export class Condition {
  /** 生产线ID */
  Line = ''

  DateTypeRadio: 'CreateTimeDateType' | 'WishFinishTimeDateType' = 'CreateTimeDateType'

  /** 创建时间 */
  CreateTime = {
    First: '',
    Second: '',
  }

  CreateTimeDateType = 'last7Date'

  /** 工期时间 | 预计完工时间 */
  WishFinishTime = {
    First: '',
    Second: '',
  }

  WishFinishTimeDateType = 'next7Date'

  /** 是否已跟进 */
  HaveTracked: '' | boolean = ''

  /** 是否已齐整 */
  HaveReady: '' | boolean = ''

  Page = 1

  PageSize = 20

  KeyWords = ''

  filter() {
    /** 处理时间 */
    CommonClassType.setDate(this, 'CreateTime', undefined, 'CreateTimeDateType');

    CommonClassType.setDate(this, 'WishFinishTime', undefined, 'WishFinishTimeDateType');

    const temp: Partial<Condition> = CommonClassType.filter(this, true, ['CreateTimeDateType', 'WishFinishTimeDateType']);

    delete temp.DateTypeRadio;
    if (this.DateTypeRadio === 'CreateTimeDateType') {
      delete temp.WishFinishTime;
    } else {
      delete temp.CreateTime;
    }

    /** 筛选结果 */
    return temp;
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
