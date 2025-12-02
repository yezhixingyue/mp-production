import clientApi from '@/api/client';
import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { IAssistantInfo, IAssistantType } from '@/views/productionResources/EquipmentAssistant/types/types';

const _AssistantInfo = {
  AssistantList: [] as IAssistantInfo[],
  AssistantTypeList: [] as IAssistantType[],
};

let assistantLoaded = false;
let assistantTypeLoaded = false;

/** 助手信息绑定列表条目 */
export interface IAssistantBindItem {
  Required: boolean;
  /** 类型ID 可能重复 */
  ID: IAssistantType['ID'];
  /** 拼接过次序的类型名称 */
  Name: string;
  Number: number;
  MemberList: IAssistantInfo[]
  /** 不会重复 */
  label: string
  /** 所在类型中的顺序 */
  index: number
}

/** 获取助手和助手类型列表数据  --- 调用时机：登录后、页面刷新后、switchToActive（该方法内是否已包含页面刷新后?） ? */
const getAssistantAndTypeList = async (force: boolean) => {
  if (!force && assistantLoaded && assistantTypeLoaded) return _AssistantInfo;

  const _getAssistantList = async () => {
    if (assistantLoaded && !force) return;

    const resp = await clientApi.getAssistantList();
    if (resp.data?.isSuccess) {
      _AssistantInfo.AssistantList = resp.data.Data.filter(it => !it.IsDisable && it.TypeList.length > 0);
      assistantLoaded = true;
    }
  };

  const _getAssistantTypeList = async () => {
    if (assistantTypeLoaded && !force) return;

    const resp = await clientApi.getAssistantTypeList();
    if (resp.data?.isSuccess) {
      _AssistantInfo.AssistantTypeList = resp.data.Data.filter(it => !it.IsDisable && it.GroupList.length > 0);
      _AssistantInfo.AssistantTypeList.sort((a, b) => a.Index - b.Index);
      assistantTypeLoaded = true;
    }
  };

  await Promise.all([_getAssistantList(), _getAssistantTypeList()]);

  return _AssistantInfo;
};

export const getNeedBindAssistantTypeList = async (Equipment: IManageEquipmentInfo, force: boolean) => {
  const { AssistantList, AssistantTypeList } = await getAssistantAndTypeList(force);

  if (!assistantTypeLoaded) return null;

  const AssistantBindList: IAssistantBindItem[] = [];

  AssistantTypeList.forEach(AssistantType => {
    const t = AssistantType.GroupList.find(it => it.ID === Equipment.GroupID); // 每个类型关联的设备组中最多只有一个能够对应上
    if (t) {
      const { MinNumber, MaxNumber } = t;
      const arr: IAssistantBindItem[] = Array.from({ length: MaxNumber }, (_, index) => {
        const Name = `${AssistantType.NickName || AssistantType.Name}${MaxNumber > 1 ? index + 1 : ''}`;
        const Required = index < MinNumber;
        const MemberList: IAssistantBindItem['MemberList'] = AssistantList.filter(it => it.TypeList.includes(AssistantType.ID));

        return {
          Required,
          ID: AssistantType.ID,
          Name,
          Number: AssistantType.Number,
          MemberList,
          label: `${AssistantType.ID}${Name}`,
          index,
        };
      });

      AssistantBindList.push(...arr);
    }
  });

  return AssistantBindList;
};
