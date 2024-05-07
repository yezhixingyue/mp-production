import { IPrintColor } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { request } from '../request';

const api = {
  // 拼版设置 ------------------------ ManageImposition
  getPrintColorSave(data) { // POST /Api/PrintColor/Save  印色保存
    return request({ method: 'POST', url: '/Api/PrintColor/Save', data });
  },
  getPrintColorList(includeGeneralColor = true) { // GET /Api/PrintColor/List  印色列表
    return request<IPrintColor[]>({ method: 'GET', url: '/Api/PrintColor/List', params: { includeGeneralColor } });
  },
  getPrintColorRemove(id) { // GET /Api/PrintColor/Remove  印色删除
    return request({ method: 'DELETE', url: `/Api/PrintColor/Remove?id=${id}` });
  },

  // 折手模板
  getFoldWayTemplateClassSave(data) { // POST /Api/FoldingTemplate/Class/Save  折手模板分类保存
    return request({ method: 'POST', url: '/Api/FoldingTemplate/Class/Save', data });
  },
  getFoldWayTemplateClassList() { // POST /Api/FoldingTemplate/Class/List  折手模板分类列表
    return request({ method: 'GET', url: '/Api/FoldingTemplate/Class/List' });
  },
  getFoldWayTemplateClassRemove(id) { // DELETE /Api/FoldingTemplate/Class/Remove  折手模板分类删除
    return request({ method: 'DELETE', url: `/Api/FoldingTemplate/Class/Remove?id=${id}` });
  },
  getFoldWayTemplateRemove(id) { // DELETE /Api/FoldingTemplate/Remove  折手模板删除
    return request({ method: 'DELETE', url: `/Api/FoldingTemplate/Remove?id=${id}` });
  },
  getFoldWayTemplateSave(data) { // POST /Api/FoldingTemplate/Save  折手模板保存
    return request({ method: 'POST', url: '/Api/FoldingTemplate/Save', data });
  },
  getFoldWayTemplateList(data) { // POST /Api/FoldingTemplate/List  折手模板列表
    return request({ method: 'POST', url: '/Api/FoldingTemplate/List', data });
  },
  getFoldWayTemplateUseableEquipment(data) { // POST /Api/FoldingTemplate/UseableEquipment  适用模板保存
    return request({ method: 'POST', url: '/Api/FoldingTemplate/UseableEquipment', data });
  },
  // 拼版模板
  getImpositionTemmplateClassSave(data) { // POST /Api/ImpositionTemmplate/Class/Save  拼版模板分类保存
    return request({ method: 'POST', url: '/Api/ImpositionTemmplate/Class/Save', data });
  },
  getImpositionTemmplateClassList() { // POST /Api/ImpositionTemmplate/Class/List  拼版模板分类列表
    return request({ method: 'GET', url: '/Api/ImpositionTemmplate/Class/List' });
  },
  getImpositionTemmplateClassRemove(id) { // DELETE /Api/ImpositionTemmplate/Class/Remove  拼版模板分类列表删除
    return request({ method: 'DELETE', url: `/Api/ImpositionTemmplate/Class/Remove?id=${id}` });
  },
  getImpositionTemmplateSave(data) { // POST /Api/ImpositionTemmplate/Save  拼版模板保存
    return request({ method: 'POST', url: '/Api/ImpositionTemplate/Save', data });
  },
  getImpositionTemmplateSizeIsEditable(data) { // POST /Api/ImpositionTemplateSize/IsEditable  拼版模板规格是否可编辑
    return request({ method: 'GET', url: `/Api/ImpositionTemplateSize/IsEditable?id=${data}` });
  },
  getImpositionTemmplateSizeSave(data) { // POST /Api/ImpositionTemplateSize/Save  拼版模板尺寸保存
    return request({ method: 'POST', url: '/Api/ImpositionTemplateSize/Save', data });
  },
  getImpositionTemmplateSizeSwitch(data) { // POST /Api/ImpositionTemplateSize/Switch  拼版模板尺寸启用状态切换
    return request({ method: 'PUT', url: `/Api/ImpositionTemplateSize/Switch?id=${data}` });
  },
  getImpositionTemmplateSizeList(data) { // POST /Api/ImpositionTemplateSize/List  拼版模板尺寸列表
    return request({ method: 'POST', url: '/Api/ImpositionTemplateSize/List', data });
  },
  getImpositionTemmplateSizeRemove(id) { // DELETE /Api/ImpositionTemplateSize/Remove  拼版模板尺寸删除
    return request({ method: 'DELETE', url: `/Api/ImpositionTemplateSize/Remove?id=${id}` });
  },
  getImpositionTemmplateList(data) { // POST /Api/ImpositionTemmplate/List  拼版模板列表
    return request({ method: 'POST', url: '/Api/ImpositionTemplate/List', data });
  },
  getImpositionTemmplateRemove(id) { // DELETE /Api/ImpositionTemmplate/Remove  拼版模板删除
    return request({ method: 'DELETE', url: `/Api/ImpositionTemplate/Remove?id=${id}` });
  },
  getEquipmentGroup() { // GET /Api/EquipmentGroup/Group 适用设备
    return request({ method: 'GET', url: '/Api/EquipmentGroup/Group' });
  },

};
export default api;
