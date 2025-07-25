import { IOrderFileInfo, IPDOrderItem, TCraftResolveDetail, TDetailInstance } from '@/views/productionManagePages/ProcessDecompositionOrderList/types/types';
import { BindingEdgeEnum } from '@/views/productionManagePages/ProcessDecompositionOrderList/types/enum';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { ILineWorkingNoteInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';
import { PDOLineInstanceType } from '../../../model/Instance';

export const getFileNameContentHtml = (filename: string, info?: { index: number; len: number; digit?: number }) => {
  let content = '';

  if (filename) {
    const digit = info?.digit || 6; // 默认长度为6

    if (filename.length > digit) {
      content = `
        <i>${filename.slice(0, -digit)}</i>
        <em style="position:relative;left:-4px">${filename.slice(-digit)}${info && info.index < info.len - 1 ? ';' : ''}</em>
      `;
    } else {
      content = `<i>${filename}${info && info.index < info.len - 1 ? ';' : ''}</i>`;
    }
  }

  return content;
};

export const handleFileChange = (file: File, item: IOrderFileInfo, FileList: IOrderFileInfo[]) => {
  const t = FileList.find(it => it._PlateTemplate
    && item._PlateTemplate
    && it._File?.name === file.name
    && it._File.lastModified === file.lastModified
    && it._File.size === file.size);

  const _item = item;

  if (t) {
    const cb = () => {
      _item._File = null;
      _item.UniqueName = '';
      _item.FileName = '';
      _item.FilePath = '';
      _item.DownloadPath = '';
    };
    MpMessage.error({
      title: '文件选择失败', msg: '拼版文件不能重复', onOk: cb, onCancel: cb,
    });
    return;
  }

  _item._File = file;
  _item.FileName = file.name;
  _item.UniqueName = '';
  _item.DownloadPath = '';
  _item.FilePath = '';
};

export const getAssistFileList = (instanceItem: PDOLineInstanceType) => {
  const list: { children: IOrderFileInfo[]; NoteInfo: IOrderFileInfo['_NoteInfo'] }[] = [];

  instanceItem.FileList.filter(it => it.AssistList?.filter(_it => _it.Type === AssistInfoTypeEnum.file).length).forEach(it => {
    const noteInfo = it.AssistList?.find(it => it.Type === AssistInfoTypeEnum.file);
    if (!noteInfo) return;

    const existing = list.find(item => item.NoteInfo?.ID === noteInfo.ID);
    if (existing) {
      existing.children.push(it);
    } else {
      list.push({ NoteInfo: noteInfo, children: [it] });
    }
  });

  return list;
};

export const getDetailAssistFileList = (instanceItem: TDetailInstance | TCraftResolveDetail) => {
  const list: { children: TDetailInstance['FileList']; NoteInfo: IOrderFileInfo['_NoteInfo'] }[] = [];

  instanceItem.FileList.filter(it => it.AssistList?.filter(_it => _it.Type === AssistInfoTypeEnum.file).length).forEach(it => {
    const noteInfo = it.AssistList?.find(it => it.Type === AssistInfoTypeEnum.file);
    if (!noteInfo) return;

    const existing = list.find(item => item.NoteInfo?.ID === noteInfo.ID);
    if (existing) {
      existing.children.push(it);
    } else {
      list.push({ NoteInfo: noteInfo, children: [it] });
    }
  });

  return list;
};

export const handleAssistUploadFileChange = (
  files: File[],
  item: { children: IOrderFileInfo[]; NoteInfo: IOrderFileInfo['_NoteInfo'];},
  instanceItem: PDOLineInstanceType,
) => {
  const FileList = [...files].map(file => ({
    UniqueName: '',
    FilePath: '',
    DownloadPath: '',
    FileName: file.name,
    _File: file,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    AssistList: [{ ...item.NoteInfo! }],
    _NoteInfo: item.NoteInfo,
    _Line: {
      ID: instanceItem._lineData?.ID || '',
      Name: instanceItem._lineData?.Name || '',
    },
    BindingEdge: BindingEdgeEnum.None,
  }));

  const _instanceItem = instanceItem;
  _instanceItem.FileList = _instanceItem.FileList.filter(it => it._NoteInfo?.ID !== item.NoteInfo?.ID);
  _instanceItem.FileList.push(...FileList);
};

export const handleAssistReviewFileChange = (
  data: { row: { ID: string; Name: string; _NoteInfo?: ILineWorkingNoteInfo}; ReviewFiles: IPDOrderItem['FileList'] },
  instanceItem: PDOLineInstanceType,
) => {
  const { _NoteInfo } = data.row;
  if (!_NoteInfo) return;

  const FileList = [...data.ReviewFiles].map(file => ({
    UniqueName: '',
    FileName: [file.PartName, file.FileName].filter(Boolean).join('-'),
    DownloadPath: file.FilePath,
    FilePath: '',
    _File: null,
    AssistList: [{ ..._NoteInfo }],
    _NoteInfo,
    _Line: {
      ID: instanceItem._lineData?.ID || '',
      Name: instanceItem._lineData?.Name || '',
    },
    BindingEdge: BindingEdgeEnum.None,
  }));

  if (FileList.length === 0) { // 至少应有一个
    const t = instanceItem.FileList.find(it => it._NoteInfo && it._NoteInfo.ID === _NoteInfo.ID);
    if (t) {
      FileList.push({
        UniqueName: '',
        FileName: '',
        DownloadPath: '',
        FilePath: '',
        _File: null,
        AssistList: [{ ..._NoteInfo }],
        _NoteInfo,
        _Line: {
          ID: instanceItem._lineData?.ID || '',
          Name: instanceItem._lineData?.Name || '',
        },
        BindingEdge: BindingEdgeEnum.None,
      });
    }
  }

  const _instanceItem = instanceItem;
  _instanceItem.FileList = _instanceItem.FileList.filter(it => it._NoteInfo?.ID !== _NoteInfo.ID);
  _instanceItem.FileList.push(...FileList);
};
