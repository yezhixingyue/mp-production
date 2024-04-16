import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { DigitalImpositionStatusEnum } from './enum';

/** 数码工单打印列表条件 */
export class Condition {
  LineID = ''

  CreateTime = { // 同步时间
    First: '',
    Second: '',
  }

  DateType = 'last7Date'

  EquipmentID = ''

  Status: DigitalImpositionStatusEnum | '' = ''

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
