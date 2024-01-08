import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { ExternalTaskStatusEnum } from './enum';
import { ISwitchOptions } from './type';

export class Condition {
  /** 外协工厂 */
  Catalog = {
    ID: '',
  }

  /** 创建时间 */
  CreateTime = {
    First: '',
    Second: '',
  }

  /** 状态 */
  Status: ExternalTaskStatusEnum | '' = ''

  DateType: string

  KeyWords = ''

  Page = 1

  PageSize = 20

  _options: ISwitchOptions

  constructor(options: ISwitchOptions) {
    this.DateType = options.showDate ? 'today' : '';
    this.Status = options.Status;
    this._options = options;
  }

  filter() {
    /** 处理时间 */
    if (this._options.DateType) CommonClassType.setDate(this, this._options.DateType);

    /** 筛选结果 */
    return CommonClassType.filter(this);
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
