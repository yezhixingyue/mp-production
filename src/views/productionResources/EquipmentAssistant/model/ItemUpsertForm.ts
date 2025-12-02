import { IAssistantInfo, IAssistantType } from '../types/types';

/** 助手条目编辑新增表单 */
export class ItemUpsertForm {
  ID = ''

  Name = ''

  IDCard = ''

  IsDisable = false

  TypeList: IAssistantType['ID'][] = []

  constructor(item: IAssistantInfo | null) {
    if (item) {
      const { ID, Name, IDCard, IsDisable, TypeList } = item;

      this.ID = ID;
      this.Name = Name;
      this.IDCard = IDCard;
      this.IsDisable = IsDisable;
      this.TypeList = [...TypeList];
    }
  }
}
