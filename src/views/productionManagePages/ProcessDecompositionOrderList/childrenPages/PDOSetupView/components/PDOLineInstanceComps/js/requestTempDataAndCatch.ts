import api from '@/api';
import { IPrintColor } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { IAssistListItem } from '@/views/productionResources/assistInfo/types';

class TempData {
  /** 辅助文件可上传格式 */
  fileAccept = ''

  /** 专色列表数据 */
  SpecialColorList: IPrintColor[] = [];

  /** 数值列表数据 */
  AssistNumbericalList: IAssistListItem[] = [];
}

let _data = new TempData();

/** 获取文件上传Accept */
export const getFileAccept = async () => {
  if (!_data.fileAccept) {
    const resp = await api.getFileSuffixList().catch(() => null);
    if (resp?.data?.isSuccess) {
      _data.fileAccept = resp.data.Data.join(',');
    }
  }

  return _data.fileAccept;
};

/** 获取专色列表数据 */
export const getSpecialColorList = async () => {
  if (_data.SpecialColorList.length === 0) {
    const resp = await api.getPrintColorList(false).catch(() => null);
    if (resp?.data?.isSuccess) {
      _data.SpecialColorList = resp.data.Data;
    }
  }

  return _data.SpecialColorList;
};

/** 获取数值列表数据 */
export const getAssistNumbericalList = async () => {
  if (_data.AssistNumbericalList.length === 0) {
    const resp = await api.getNoteAll(AssistInfoTypeEnum.numerical).catch(() => null);
    if (resp?.data?.isSuccess) {
      _data.AssistNumbericalList = resp.data.Data;
    }
  }
  return _data.AssistNumbericalList;
};

/**  */

export const clearRequestTempData = () => {
  _data = new TempData();
};
