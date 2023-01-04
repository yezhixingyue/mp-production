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
}
