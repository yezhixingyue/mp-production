import { computed, ref } from 'vue';
import { AssistantListManageModel } from '../model/AssistantListManageModel';

export const localAssistantManageModel = ref<AssistantListManageModel | null>(null);

export const localAssistantTypeList = computed(() => {
  const list = [...localAssistantManageModel.value?.AssistantTypeList || []].map(it => (it.IsDisable ? { ...it, Name: `${it.Name}（已禁用）` } : it));

  list.sort((a, b) => Number(a.IsDisable) - Number(b.IsDisable));

  return list;
});
