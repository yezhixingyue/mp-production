import { Ref, ref } from 'vue';
import { ComputerForm } from '../model/Computer';
import { ComputerListManageClass } from '../model/ComputerListManageClass';
import { ICallinStateInfo, IComputer, IRemarkSubmitParams } from '../types/type';
import { ComputerUseStateEnum, EquipmentHistoryTypeEnum } from '../types/enum';

export const useSaveDialog = (localManageListData: Ref<ComputerListManageClass>) => {
  const visible = ref(false);
  const row = ref<null | IComputer>(null);
  const isCopy = ref(false);

  let _computerSaveParams: ReturnType<ComputerForm['getParams']> | null = null;

  const remarkVisible = ref(false);
  const operationType = ref(EquipmentHistoryTypeEnum.create);

  const onDialogSaveClick = (item: null | IComputer, _isCopy = false) => {
    row.value = item;
    isCopy.value = _isCopy;
    visible.value = true;
  };

  const onRemarkDialogOpen = (type: EquipmentHistoryTypeEnum, item: null | IComputer) => { // 备注弹窗打开
    operationType.value = type;
    row.value = item;
    remarkVisible.value = true;
  };

  const onDialogSubmitClick = (params: ReturnType<ComputerForm['getParams']>) => {
    _computerSaveParams = params;

    onRemarkDialogOpen(_computerSaveParams?.id ? EquipmentHistoryTypeEnum.update : EquipmentHistoryTypeEnum.create, row.value);
  };

  const onRemarkDialogSubmit = (remarkData: IRemarkSubmitParams, callinStateData?: ICallinStateInfo) => { // 备注弹窗保存
    const callback = () => {
      visible.value = false;
      remarkVisible.value = false;
    };

    if (remarkData.type === EquipmentHistoryTypeEnum.abandon && row.value) {
      localManageListData.value.changeState({ id: row.value.id, user: null, state: ComputerUseStateEnum.abandoned }, remarkData, callback);
      return;
    }

    if (remarkData.type === EquipmentHistoryTypeEnum.callout && row.value) {
      localManageListData.value.changeState({ id: row.value.id, user: null, state: ComputerUseStateEnum.calledout }, remarkData, callback);
      return;
    }

    if (remarkData.type === EquipmentHistoryTypeEnum.callin && row.value && callinStateData) {
      localManageListData.value.changeState({ id: row.value.id, ...callinStateData }, remarkData, callback);
      return;
    }

    if (!_computerSaveParams) return;

    const data = {
      params: _computerSaveParams,
      remark: remarkData,
    };

    localManageListData.value.save(data, callback);
  };

  return { visible, row, isCopy, remarkVisible, operationType, onDialogSaveClick, onDialogSubmitClick, onRemarkDialogOpen, onRemarkDialogSubmit };
};
