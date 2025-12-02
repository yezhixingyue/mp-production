import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';

/** 设备助手列表获取条件类 */
export class Condition {
  Type: number | '' = ''

  Page = 1

  PageSize = 20

  KeyWords = ''

  filter() {
    /** 处理时间 */
    // CommonClassType.setDate(this, 'CreateTime');

    /** 筛选结果 */
    return CommonClassType.filter(this);
  }

  setCondition(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
