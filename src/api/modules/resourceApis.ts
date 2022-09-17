import { IAssistListItem } from '@/views/productionResources/assistInfo/types';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { ISubcontractorFactoryListItemType } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorFactory';
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
  /** 生产资源 - 设备分类相关 EquipmentClassification
   -------------------------------------------- */
  getEquipmentClassificationSave(data) { // POST /Api/EquipmentClass/Save  设备分类编辑
    return request<unknown, string>({ method: 'POST', url: '/Api/EquipmentClass/Save', data });
  },
  getEquipmentClassificationList() { // POST /Api/EquipmentClass/List  设备分类查询
    return request<unknown, EquipmentClassificationListItem[]>({ method: 'GET', url: '/Api/EquipmentClass/List' });
  },
  getEquipmentClassificationRemove(id) { // POST /Api/EquipmentClass/Remove  设备分类删除
    return request({ method: 'DELETE', url: '/Api/EquipmentClass/Remove', params: { id } });
  },
  /** 生产资源 - 外协工厂相关 subcontractor
   -------------------------------------------- */
  getSubcontractorFactorySave(data) { // POST /Api/Factory/Save   外协工厂编辑保存
    return request<unknown, string>({ method: 'POST', url: '/Api/Factory/Save', data });
  },
  getSubcontractorFactoryList(conditon) { // POST /Api/Factory/List  外协工厂列表
    return request<unknown, ISubcontractorFactoryListItemType[]>({ method: 'POST', url: '/Api/Factory/List', data: conditon });
  },
  getSubcontractorFactoryRemove(factoryID) { // DELETE /Api/Factory/Remove  外协工厂删除
    return request({ method: 'DELETE', url: '/Api/Factory/Remove', params: { factoryID } });
  },
};
