import { OrderStatus } from './enum';

export class Condition {
  /** 创建时间 */
  CreateTime = {
    First: '',
    Second: '',
  }

  DateType = 'today'

  LineID = ''

  UnImposition = false

  Status: OrderStatus | '' = ''

  KeyWords = ''

  Page = 1

  PageSize = 20
}
