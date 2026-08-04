import api from '@/api';
import { onMounted, ref } from 'vue';
import { INoteDisplayPosition } from '../../types';

export const useNoteDisplayPositionList = () => {
  const NoteDisplayPositionList = ref<INoteDisplayPosition[]>([]);

  const getNoteDisplayPositionList = async () => {
    const resp = await api.getNoteDisplayPositionList();
    if (resp.data?.isSuccess) {
      NoteDisplayPositionList.value = resp.data.Data || [];
    }
  };

  onMounted(() => {
    getNoteDisplayPositionList();
  });

  return { NoteDisplayPositionList };
};
