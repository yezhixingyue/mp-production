import { IPrintColor } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IOrderFileInfo } from '@/views/productionManagePages/ProcessDecompositionOrderList/types/types';
import { ComputedRef, ref } from 'vue';
import { getSpecialColorList } from '../js/requestTempDataAndCatch';
import { PDOLineInstanceType } from '../../../model/Instance';
import { PDOSetupViewStore } from '../../../store/PDOSetupViewStore';

/** 专色相关设置 */
export const useSpecialColor = (instanceItem: ComputedRef<PDOLineInstanceType>) => {
  const specialColorState = ref({
    visible: false,
    colorList: [] as IPrintColor[], // 专色列表数据
  });

  const setSpecialColorVisible = async () => {
    specialColorState.value.colorList = await getSpecialColorList();

    if (PDOSetupViewStore.value?.ruleForm) PDOSetupViewStore.value.ruleForm.ColorList = specialColorState.value.colorList;

    specialColorState.value.visible = true;
  };

  const onSpecialColorSubmit = (list: IPrintColor[]) => {
    if (instanceItem.value.handleSpecialColorChange) instanceItem.value.handleSpecialColorChange(list);
  };

  const onColorRemoveClick = (color: IOrderFileInfo) => {
    MpMessage.warn({
      title: '确定删除该专色吗',
      msg: `专色名称: [ ${color._SpecialColorInfo?.Name} ]`,
      onOk: () => {
        const list = instanceItem.value.FileList.map(it => it._SpecialColorInfo).filter(it => it && it.ID !== color._SpecialColorInfo?.ID) as IPrintColor[];
        onSpecialColorSubmit(list);
      },
    });
  };

  return { specialColorState, setSpecialColorVisible, onSpecialColorSubmit, onColorRemoveClick };
};
