import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';

/** 列表筛选条件 --- 暂提前入尾版 和 追加印数 共用 */
export class AdjustCondition {
  LineID = ''

  CreateTime = {
    First: '',
    Second: '',
  }

  DateType = 'today'

  KeyWords = ''

  Page = 1

  PageSize = 20

  filter() {
    /** 处理时间 */
    CommonClassType.setDate(this, 'CreateTime', { First: 'First', Second: 'Second' });

    /** 筛选结果 */
    return CommonClassType.filter(this);
  }

  setCondition(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
