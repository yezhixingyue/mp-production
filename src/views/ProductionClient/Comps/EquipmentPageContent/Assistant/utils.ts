import { IAssistantBindItem } from '@/views/ProductionClient/assets/js/AssistantBindHelper';
import { IEquipmentBindAssistantInfo } from '@/views/ProductionClient/assets/js/types';

export const getAssistantRuleFormObj = (NeedBindAssistantList: IAssistantBindItem[], AssistantList: IEquipmentBindAssistantInfo[] | null) => {
  const temp: { [key: string]: string } = {};

  NeedBindAssistantList.forEach(it => {
    // temp[`${it.label}`] = AssistantList?.find(_it => _it.label === it.label)?.MemberID || '';
    temp[`${it.label}`] = AssistantList?.find(_it => _it.TypeID === it.ID && _it.index === it.index)?.MemberID || '';
  });

  return temp;
};

export const getAssistantParamsList = (ruleForm: ReturnType<typeof getAssistantRuleFormObj>, NeedBindAssistantList: IAssistantBindItem[] | null) => {
  const arr: (IAssistantBindItem & { value: string })[] = [];

  Object.entries(ruleForm).forEach(([key, value]) => {
    const label = key;
    const t = NeedBindAssistantList?.find(it => it.label === label);
    if (t) {
      arr.push({ ...t, value });
    }
  });

  const List: IEquipmentBindAssistantInfo[] = arr.map(it => {
    const Member = it.MemberList.find(m => m.ID === it.value);

    return {
      TypeID: it.ID,
      TypeName: it.Name,
      MemberID: Member?.ID || '',
      MemberName: Member?.Name || '',
      // label: it.label,
      Required: it.Required,
      index: it.index,
    };
  });

  return List;
};
