import { computed, Ref } from 'vue';
import { IUnionTaskDetail } from '../../../types/type';
import { UnionTaskResourceStatusEnum } from '../../../types/enum';

export const useStatus = (taskDetail: Ref<null | IUnionTaskDetail>) => {
  const _statuses = computed(() => (taskDetail.value ? taskDetail.value.List.map(it => it.Status) : []));

  /** 已全部送达 */
  const isAllReceived = computed(() => new Set(_statuses.value).size === 1 && _statuses.value.includes(UnionTaskResourceStatusEnum.HaveReceived));

  /** 已全部生产完成（包含已全部送达状态） */
  const isAllProduced = computed(() => _statuses.value.length > 0 && new Set(_statuses.value).size <= 2
   && !_statuses.value.includes(UnionTaskResourceStatusEnum.UnReport));

  return { isAllReceived, isAllProduced };
};
