import { IAssistListItem } from '@/views/productionResources/assistInfo/types';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { ISubcontractorFactoryListItemType } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorFactory';
import { EquipmentGroupItemType } from '@/store/modules/resource/EquipmentGroupTypeClass/EquipmentGroupItemClass';
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
  /** 生产资源 - 物料资源包相关 resourceBundle
   -------------------------------------------- */
  getMaterialGroupSave(data) { // POST /Api/MaterialGroup/Save 资源包编辑
    return request<unknown, string>({ method: 'POST', url: '/Api/MaterialGroup/Save', data });
  },
  getMaterialGroupList(condition) { // POST /Api/MaterialGroup/List   资源包列表
    return request({ method: 'POST', url: '/Api/MaterialGroup/List', data: condition });
  },
  getMaterialGroupRemove(groupID) { // DELETE /Api/MaterialGroup/Remove  资源包删除
    return request({ method: 'DELETE', url: '/Api/MaterialGroup/Remove', params: { groupID } });
  },
  getMaterialTypeGroup() { // GET /Api/MaterialType/Group  根据类别分组查询返回物料类型数据
    return request({ method: 'GET', url: '/Api/MaterialType/Group' });
  },
  /** 生产资源 - 设备组相关 EquipmentGroup
  --------------------------------------------- */
  getEquipmentGroupSave(data) { // POST /Api/EquipmentGroup/Save   设备组添加|保存
    return request<unknown, string>({ method: 'POST', url: '/Api/EquipmentGroup/Save', data });
  },
  getEquipmentGroupList(conditon) { // POST /Api/EquipmentGroup/List   设备组查询
    return request<unknown, EquipmentGroupItemType[]>({ method: 'POST', url: '/Api/EquipmentGroup/List', data: conditon });
  },
  getEquipmentGroupRemove(groupID) { // DELETE /Api/EquipmentGroup/Remove   设备组删除
    return request({ method: 'DELETE', url: '/Api/EquipmentGroup/Remove', params: { groupID } });
  },
  getEquipmentGroupSizeLimit(data) { // POST /Api/EquipmentGroup/SizeLimit   尺寸限制
    return request({ method: 'POST', url: '/Api/EquipmentGroup/SizeLimit', data });
  },
  getEquipmentGroupColorLimit(data) { // POST /Api/EquipmentGroup/ColorLimit   印色数量限制
    return request({ method: 'POST', url: '/Api/EquipmentGroup/ColorLimit', data });
  },
  /** 生产资源 - 加工设备相关 Equipment
  --------------------------------------------- */
  getEquipmentSave(data) { // POST /Api/Equipment/Save   加工设备保存
    return request({ method: 'POST', url: '/Api/Equipment/Save', data });
  },
  getEquipmentList(condition) { // POST /Api/Equipment/List   获取加工设备列表 -- 建立条件类
    return request({ method: 'POST', url: '/Api/Equipment/List', data: condition });
  },
};
