import CommonClassType from '@/store/modules/formattingTime/CommonClassType';
import { ChunkStatusEnum } from './enum';

export class Condition {
  /** 创建时间 */
  CreateTime = {
    First: '',
    Second: '',
  }

  DateType = 'today'

  KeyWords = ''

  LineID = ''

  Status: ChunkStatusEnum | '' = ''

  Page = 1

  PageSize = 20

  filter() {
    /** 处理时间 */
    CommonClassType.setDate(this, 'CreateTime');

    /** 筛选结果 */
    return CommonClassType.filter(this, true);
  }
}
