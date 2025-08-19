import api from '@/api';
import { onMounted, ref } from 'vue';

export interface INoteDisplayPosition {
  Key: string;
  Name: string;
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
