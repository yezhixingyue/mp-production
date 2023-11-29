import { PlateStatusEnum, PlateTypeEnum } from './enum';

export class Condition {
  /** 创建时间 */
  CreateTime = {
    First: '',
    Second: '',
  }

  DateType = 'today'

  Type: PlateTypeEnum // 0是印刷版  10是后工版

  KeyWords = ''

  _WorkingID = '' // 制版工序ID 仅后工版列表使用 - 暂仅前端页面使用 对服务器无用

  LineID = ''

  Status: PlateStatusEnum | '' = ''

  Page = 1

  PageSize = 20

  constructor(type: PlateTypeEnum) {
    this.Type = type;
  }
}
