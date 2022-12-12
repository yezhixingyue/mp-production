import request from '../request/request';

const api = {
  // 拼版设置 ------------------------ ManageImposition
  getPrintColorSave(data) { // POST /Api/PrintColor/Save  印色保存
    return request({ method: 'POST', url: '/Api/PrintColor/Save', data });
  },
  getPrintColorList() { // GET /Api/PrintColor/List  印色列表
    return request({ method: 'GET', url: '/Api/PrintColor/List' });
  },
  getPrintColorRemove(id) { // GET /Api/PrintColor/Remove  印色删除
    return request({ method: 'DELETE', url: `/Api/PrintColor/Remove?id=${id}` });
  },

  // 折手模板
  getFoldWayTemplateClassSave(data) { // POST /Api/FoldWayTemplate/Class/Save  折手模板分类保存
    return request({ method: 'POST', url: '/Api/FoldWayTemplate/Class/Save', data });
  },
  getFoldWayTemplateClassList() { // POST /Api/FoldWayTemplate/Class/List  折手模板分类列表
    return request({ method: 'GET', url: '/Api/FoldWayTemplate/Class/List' });
  },
  getFoldWayTemplateClassRemove(id) { // DELETE /Api/FoldWayTemplate/Class/Remove  折手模板分类删除
    return request({ method: 'DELETE', url: `/Api/FoldWayTemplate/Class/Remove?id=${id}` });
  },
  getFoldWayTemplateRemove(id) { // DELETE /Api/FoldWayTemplate/Remove  折手模板删除
    return request({ method: 'DELETE', url: `/Api/FoldWayTemplate/Remove?id=${id}` });
  },
  getFoldWayTemplateSave(data) { // POST /Api/FoldWayTemplate/Save  折手模板保存
    return request({ method: 'POST', url: '/Api/FoldWayTemplate/Save', data });
  },
  getFoldWayTemplateList(data) { // POST /Api/FoldWayTemplate/List  折手模板列表
    return request({ method: 'POST', url: '/Api/FoldWayTemplate/List', data });
  },
  getFoldWayTemplateUseableEquipment(data) { // POST /Api/FoldWayTemplate/UseableEquipment  适用模板保存
    return request({ method: 'POST', url: '/Api/FoldWayTemplate/UseableEquipment', data });
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
  getImpositionTemmplateSizeSave(data) { // POST /Api/ImpositionTemplateSize/Save  拼版模板尺寸保存
    return request({ method: 'POST', url: '/Api/ImpositionTemplateSize/Save', data });
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
