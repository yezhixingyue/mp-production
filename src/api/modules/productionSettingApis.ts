import request from '../request/request';

const api = {
  // 工序 ------------------------ WorkingProcedure
  getWorkingProcedureList(data) { // POST /Api/WorkingProcedure/List  工序列表
    return request({ method: 'POST', url: '/Api/WorkingProcedure/List', data });
  },
  getWorkingProcedureSave(data) { // POST /Api/WorkingProcedure/Save  工序保存
    return request({ method: 'POST', url: '/Api/WorkingProcedure/Save', data });
  },
  getWorkingProcedureRemove(ID) { // POST /Api/WorkingProcedure/Remove  工序删除
    return request({ method: 'DELETE', url: `/Api/WorkingProcedure/Remove?id=${ID}` });
  },

  // 生产线 ------------------------ ProductionLine
  getProductionLineSave(data) { // POST /Api/ProductionLine/Save  生产线保存
    return request({ method: 'POST', url: '/Api/ProductionLine/Save', data });
  },
  getProductionLineList() { // POST /Api/ProductionLine/List  生产线列表
    return request({ method: 'POST', url: '/Api/ProductionLine/List' });
  },
  getProductionLineRemove(ID) { // POST /Api/ProductionLine/Remove  生产线删除
    return request({ method: 'DELETE', url: `/Api/ProductionLine/Remove?id=${ID}` });
  },
  getProductionLineAddWorkingProcedure(data) { // POST /Api/ProductionLine/AddWorkingProcedure  生产线添加工序
    return request({ method: 'POST', url: '/Api/ProductionLine/AddWorkingProcedure', data });
  },

  //

};
export default api;
