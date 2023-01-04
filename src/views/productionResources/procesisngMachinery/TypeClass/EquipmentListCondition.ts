import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';

export class EquipmentListCondition {
  ClassID: number | '' = ''

  GroupID = ''

  IsUseable: boolean | '' = ''

  Page = 1

  PageSize = 20

  KeyWords = ''

  filter() {
    return CommonClassType.filter(this);
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
