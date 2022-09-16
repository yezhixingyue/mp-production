import { IAssistListItem } from '@/views/productionResources/assistInfo/types';
import request from '../request/request';

export const resourceApis = {
  /** 生产资源 - 辅助信息相关
   -------------------------------------------- */
  getResourceNoteSave(data) { // POST /Api/Note/Save  辅助信息编辑
    return request<unknown, string>({ method: 'POST', url: '/Api/Note/Save', data });
  },
  getResourceNoteList(condition) { // POST /Api/Note/List  辅助信息查询
    return request<unknown, IAssistListItem[]>({ method: 'POST', url: '/Api/Note/List', data: condition });
  },
  getResourceNoteRemove(noteID) { // POST /Api/Note/Remove  辅助信息删除
    return request({ method: 'DELETE', url: '/Api/Note/Remove', params: { noteID } });
  },
};
