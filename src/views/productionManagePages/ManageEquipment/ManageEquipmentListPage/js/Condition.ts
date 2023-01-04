import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';

export class Condition {
  ClassID: number | '' = ''

  GroupID = ''

  Page = 1

  PageSize = 20

  KeyWords = ''

  IsUseable = true

  filter() {
    return CommonClassType.filter(this);
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
