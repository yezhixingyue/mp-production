import api from '@/api';
import { onMounted, ref } from 'vue';
import { AssistInfoTypeEnum } from '../TypeClass/assistListConditionClass';

export interface INoteDisplayPosition {
  Key: string;
  Name: string;
  Types: AssistInfoTypeEnum[]
}

export const useNoteDisplayPositionList = () => {
  const NoteDisplayPositionList = ref<INoteDisplayPosition[]>([]);

  onMounted(async () => {
    const resp = await api.getNoteDisplayPositionList();
    if (resp.data?.isSuccess) {
      NoteDisplayPositionList.value = resp.data.Data || [];
    }
  });

  return { NoteDisplayPositionList };
};
