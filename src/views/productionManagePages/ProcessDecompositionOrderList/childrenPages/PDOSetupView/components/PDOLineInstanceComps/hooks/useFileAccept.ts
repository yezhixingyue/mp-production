import { onMounted, ref } from 'vue';
import { getFileAccept } from '../js/requestTempDataAndCatch';

export const useFileAccept = () => {
  const fileAccept = ref({
    pdf: '.pdf',
    assist: '',
  });

  onMounted(async () => {
    fileAccept.value.assist = await getFileAccept();
  });

  return { fileAccept };
};
