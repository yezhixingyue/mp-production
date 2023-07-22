import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { ILineDetailWorkingProcedure } from '../../../js/ProductionLineDetailTypes';
import { IConvertAssistInfo } from '../../../js/types';

/** 获取第三步展示中生产工序展示内容 */
export const getWorkProcessContent = (WorkingList: ILineDetailWorkingProcedure[], AssistList: IConvertAssistInfo[], type = AssistInfoTypeEnum.text) => {
  const list = WorkingList.map(it => {
    const { Name } = it;
    const content = it.NoteInfos
      .filter(it => it.Type === type)
      .map(it => AssistList.find(_it => _it.ID === it.ID))
      .filter(it => it && it.Content)
      .map(it => it?.Content)
      .join(',');
    return { Name, Content: content || '' };
  });
  return list;
};
