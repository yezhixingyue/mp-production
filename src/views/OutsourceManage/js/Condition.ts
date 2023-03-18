import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { ExternalTaskStatusEnum } from './enum';
import { ISwitchOptions } from './type';

export class Condition {
  /** 外协工厂 */
  Catalog = {
    ID: '',
  }

  /** 完成时间 */
  FinishTime = {
    First: '',
    Second: '',
  }

  /** 状态 */
  Status: ExternalTaskStatusEnum | '' = ''

  DateType: string

  KeyWords = ''

  Page = 1

  PageSize = 20

  constructor(options: ISwitchOptions) {
    this.DateType = options.showDate ? 'today' : '';
    this.Status = options.Status;
  }

  filter() {
    /** 处理时间 */
    CommonClassType.setDate(this, 'FinishTime');

    /** 筛选结果 */
    return CommonClassType.filter(this);
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
