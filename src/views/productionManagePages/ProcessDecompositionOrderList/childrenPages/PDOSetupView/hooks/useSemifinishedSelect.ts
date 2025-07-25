import { Ref, ref } from 'vue';
import { ILineWorkingMaterialSources } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';
import { TPDOSetupClass } from '../model/PDOSetupClass';
import { PDOLineInstance } from '../model/Instance';

/** 添加半成品相关 */
export const useSemifinishedSelect = (pageStore: Ref<TPDOSetupClass | null>) => {
  const semiFState = ref({
    visible: false,
    allList: [] as ILineWorkingMaterialSources[],
    checkedIds: [] as string[],
  });

  const onSemifinishedAddClick = () => {
    // 1. 全部半成品列表数据
    semiFState.value.allList = pageStore.value?.ruleForm?._SemifinishedList || [];

    // 2. 已选中半成品id列表
    semiFState.value.checkedIds = [...new Set(pageStore.value?.ruleForm?.InstanceList.map(it => it.SemiFinished?.ID).filter(Boolean))] as string[];

    // 3. 打开弹窗
    semiFState.value.visible = true;
  };

  const onSemiFSubmit = (newIds: string[]) => { // 只能增不能减
    const newItems = semiFState.value.allList.filter(it => newIds.includes(it.MaterialTypeID));
    if (newItems.length === 0) return;

    newItems.forEach(m => {
      pageStore.value?.ruleForm?.InstanceList.push(new PDOLineInstance(true, null, m));
    });
  };

  return { semiFState, onSemifinishedAddClick, onSemiFSubmit };
};
