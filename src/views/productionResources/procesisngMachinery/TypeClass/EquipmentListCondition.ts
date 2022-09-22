import CommonClassType from '@/store/modules/formattingTime/CommonClassType';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setConditon(e: [[string, string], any]) {
    return CommonClassType.setCondition(e, this);
  }
}
