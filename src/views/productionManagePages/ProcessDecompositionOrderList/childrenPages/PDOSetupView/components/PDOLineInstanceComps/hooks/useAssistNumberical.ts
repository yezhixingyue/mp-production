import { ComputedRef, ref } from 'vue';
import { IAssistListItem } from '@/views/productionResources/assistInfo/types';
import { IConvertAssistInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { getAssistNumbericalList } from '../js/requestTempDataAndCatch';
import { PDOLineInstanceType } from '../../../model/Instance';

export const useAssistNumberical = (instanceItem: ComputedRef<PDOLineInstanceType>) => {
  const numbericalState = ref({
    visible: false,
    AssistNumbericalList: [] as IAssistListItem[],
    changeVisible: false, // 数值修改弹窗
    curNumbericalItem: null as IConvertAssistInfo | null,
  });

  const setNumbericalVisible = async () => {
    numbericalState.value.AssistNumbericalList = await getAssistNumbericalList();
    numbericalState.value.visible = true;
  };

  const onNumbericSubmit = (list: IConvertAssistInfo[]) => {
    instanceItem.value.handleNumbericChange(list);
  };

  const onNumbericalRemoveClick = (it: IConvertAssistInfo) => {
    MpMessage.warn({
      title: '确定删除该数值吗',
      msg: `名称: [ ${it.Name} ]`,
      onOk: () => {
        const list = instanceItem.value.AssistList.filter(_it => _it && _it.Type === AssistInfoTypeEnum.numerical && _it.ID !== it.ID);
        onNumbericSubmit(list);
      },
    });
  };

  const setNumbericalChange = (it: IConvertAssistInfo) => {
    numbericalState.value.curNumbericalItem = it;
    numbericalState.value.changeVisible = true;
  };

  const onNumbericalChangeSubmit = (data: { ID: string, Value: number }) => {
    if (numbericalState.value.curNumbericalItem) {
      numbericalState.value.curNumbericalItem.Value = data.Value;
    }
  };

  return { numbericalState, setNumbericalVisible, onNumbericSubmit, onNumbericalRemoveClick, setNumbericalChange, onNumbericalChangeSubmit };
};
