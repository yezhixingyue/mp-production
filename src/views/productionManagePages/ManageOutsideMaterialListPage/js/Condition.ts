import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { ExternalMaterialStatusEnum } from './enum';

export class Condition {
  CreateTime = {
    First: '',
    Second: '',
  }

  Status: ExternalMaterialStatusEnum | '' = ''

  KeyWords = ''

  Page = 1

  PageSize = 20

  DateType = 'today'

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
