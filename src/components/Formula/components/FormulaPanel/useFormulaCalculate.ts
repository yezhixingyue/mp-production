import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { ModelRef, ref } from 'vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import api from '@/api';
import { validateFormulaContent } from './utils';

export const useFormulaCalculate = (PropertyList: ModelRef<PropertyListItemType[], string>, Content: ModelRef<string, string>) => {
  const calculateResult = ref<null | string>(null);

  const onCalculateClick = async () => {
    calculateResult.value = null;

    if (!validateFormulaContent(Content.value, '计算失败')) return;

    if (PropertyList.value && PropertyList.value.length > 0) {
      let t = PropertyList.value.find(it => !it.CalculateValue && Content.value.includes(it.DisplayContent));
      if (t) {
        MpMessage.error('计算失败', `${t.DisplayContent}未设置测试计算数值`);
        return;
      }

      t = PropertyList.value.find(it => Content.value.includes(it.DisplayContent) && it.CalculateValue && !/^[-+]?\d+(\.\d+)?$/.test(it.CalculateValue));
      if (t) {
        MpMessage.error('计算失败', `${t.DisplayContent}值不是数字类型`);
        return;
      }
    }

    const resp = await api.formulaApis.getFormulaCalculate({
      PropertyList: PropertyList.value,
      Content: Content.value,
    });

    if (resp.data?.isSuccess) {
      calculateResult.value = resp.data.Data;
    }
  };

  return { calculateResult, onCalculateClick };
};
