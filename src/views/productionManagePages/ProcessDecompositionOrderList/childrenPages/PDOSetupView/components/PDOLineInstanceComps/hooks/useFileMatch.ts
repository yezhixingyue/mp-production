import { ComputedRef, ref } from 'vue';
import { IOrderFileInfo, IPDOrderItem } from '@/views/productionManagePages/ProcessDecompositionOrderList/types/types';
import { ILineWorkingNoteInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';
import { handleAssistReviewFileChange } from '../js/tools';
import { PDOLineInstanceType } from '../../../model/Instance';

export type FileMatchType = 'makeup' | 'assist' | 'color';

/** 匹配拼版、辅助、专色文件 */
export const useFileMatch = (instanceItem: ComputedRef<PDOLineInstanceType>) => {
  const fileMatchState = ref({
    visible: false,
    type: 'makeup' as FileMatchType,
  });

  const onFileMatchClick = (type: FileMatchType) => {
    fileMatchState.value.type = type;
    fileMatchState.value.visible = true;
  };

  const onFileMatchSubmit = (list: { row: { ID: string; Name: string; _NoteInfo?: ILineWorkingNoteInfo}; ReviewFiles: IPDOrderItem['FileList'] }[]) => {
    let target: IOrderFileInfo | undefined;

    const setFilePath = (row: IOrderFileInfo, ReviewFile?: IPDOrderItem['FileList'][number]) => {
      const _row = row;
      _row.UniqueName = '';
      _row.FilePath = '';
      _row._File = null;
      _row.FileName = [ReviewFile?.PartName, ReviewFile?.FileName].filter(Boolean).join('-');
      _row.DownloadPath = ReviewFile?.FilePath;
    };

    switch (fileMatchState.value.type) {
      case 'makeup':
        list.forEach(item => {
          target = instanceItem.value.FileList.find(it => it._PlateTemplate?.ID === item.row.ID);
          if (target) {
            setFilePath(target, item.ReviewFiles[0]);
          }
        });
        break;
      case 'assist':
        list.forEach(item => {
          handleAssistReviewFileChange(item, instanceItem.value);
        });
        break;
      case 'color':
        list.forEach(item => {
          target = instanceItem.value.FileList.find(it => it._SpecialColorInfo?.ID === item.row.ID);
          if (target) {
            setFilePath(target, item.ReviewFiles[0]);
          }
        });
        break;
      default:
        break;
    }
  };

  return { fileMatchState, onFileMatchClick, onFileMatchSubmit };
};
