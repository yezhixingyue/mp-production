import { IAssistantType } from '../../../types/types';

/** 助手类型新增|编辑表单类 */
export class TypeEditRuleForm {
  ID: number | '' = ''

  Name = ''

  NickName = ''

  Index = 1

  IsDisable = false

  Number = 1

  constructor(data: null | IAssistantType) {
    if (data) {
      const { ID, Name, NickName, Index, IsDisable, Number } = data;

      this.ID = ID;
      this.Name = Name;
      this.NickName = NickName;
      this.Index = Index;
      this.IsDisable = IsDisable;
      this.Number = Number;
    }
  }
}
