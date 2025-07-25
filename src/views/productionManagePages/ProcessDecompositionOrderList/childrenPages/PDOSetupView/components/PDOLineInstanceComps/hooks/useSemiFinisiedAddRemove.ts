import { MpMessage } from '@/assets/js/utils/MpMessage';
import { computed, ComputedRef } from 'vue';
import { ElMessage } from 'element-plus';
import { PDOLineInstanceType } from '../../../model/Instance';
import { TPDOCraftResolveForm } from '../../../model/ruleForm';

export const useSemiFinisiedAddRemove = (
  instanceItem: ComputedRef<PDOLineInstanceType>,
  props: {
    ruleForm: TPDOCraftResolveForm
    index: number
  },
) => {
  const curInsPoi = computed(() => {
    const list = props.ruleForm.InstanceList.filter(it => it.SemiFinished?.ID === instanceItem.value.SemiFinished?.ID);

    const index = list.findIndex(it => it === instanceItem.value);

    const insName = `${instanceItem.value.SemiFinished?.Name || ''}${list.length > 1 ? `-${index + 1}` : ''}`;

    return { len: list.length, index, insName };
  });

  const canRemove = computed(() => {
    /** 非必需资源 任何时候可删除 */
    if (!instanceItem.value._MaterialSource?.NeedResource) return true;

    /** 仅剩1个情况下 不可删除 */
    // const t = props.ruleForm.InstanceList
    //   .find((it, i) => i !== props.index && it.SemiFinished && it.SemiFinished?.ID === instanceItem.value.SemiFinished?.ID);
    // if (!t) {
    //   return false;
    // }

    return curInsPoi.value.len > 1;
  });

  const onSemiFinisiedRemoveClick = () => {
    if (!instanceItem.value._lineData && instanceItem.value._MaterialSource) {
      const _name = curInsPoi.value.insName;
      props.ruleForm.removeOrAddInstance('remove', props.index);
      ElMessage.success({ message: `[ ${_name} ] 已删除` });
      return;
    }

    MpMessage.warn({
      title: '确定删除该半成品吗 ?',
      msg: `半成品名称：[ ${curInsPoi.value.insName} ]`,
      onOk: () => {
        setTimeout(() => {
          props.ruleForm.removeOrAddInstance('remove', props.index);
        }, 50);
      },
    });
  };
  const onSemiFinisiedAddClick = () => {
    if (!instanceItem.value._MaterialSource) return;
    console.log(instanceItem.value._MaterialSource.MaterialTypeName);
    props.ruleForm.removeOrAddInstance('add', props.index, instanceItem.value._MaterialSource);
    ElMessage.success({ message: `已新增一个半成品： [ ${instanceItem.value._MaterialSource.MaterialTypeName} ]` });
  };

  return { curInsPoi, canRemove, onSemiFinisiedRemoveClick, onSemiFinisiedAddClick };
};
