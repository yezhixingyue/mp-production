import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';

export class Condition {
  /** 生产线ID */
  Line = ''

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

  WishFinishTimeDateType = 'last7Date'

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

    /** 筛选结果 */
    return CommonClassType.filter(this, true, ['CreateTimeDateType', 'WishFinishTimeDateType']);
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
