import request from '../request/request';

const api = {
  // 配送方式 ------------------------ Express
  getExpressList() { // POST /Api/Express/List  配送方式列表
    return request({ method: 'GET', url: '/Api/Express/List' });
  },
  // 发货班次 ------------------------ ShiftTime
  getShiftTimeList(data) { // POST /Api/ShiftTime/List  发货班次列表
    return request({ method: 'POST', url: '/Api/ShiftTime/List', data });
  },
  getShiftTimeSave(data) { // POST /Api/ShiftTime/Save  发货班次保存
    return request({ method: 'POST', url: '/Api/ShiftTime/Save', data });
  },
  getShiftTimeDetail(id) { // GET /Api/ShiftTime/Detail  发货班次保存
    return request({ method: 'GET', url: `/Api/ShiftTime/Detail?id=${id}` });
  },

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
  getProductionLineWorkingProcedureAdd(data) { // POST /Api/ProductionLine/WorkingProcedure/Add  生产线添加工序
    return request({ method: 'POST', url: '/Api/ProductionLine/WorkingProcedure/Add', data });
  },
  getProductionLineWorkingProcedureList(data) { // POST /Api/ProductionLine/WorkingProcedure/List  生产线添加工序
    return request({ method: 'POST', url: '/Api/ProductionLine/WorkingProcedure/List', data });
  },
  getProductionLinetMaterialSourceList(ID) { // POST /Api/ProductionLine/MaterialSource/List  生产线物料来源列表
    return request({ method: 'GET', url: `/Api/ProductionLine/MaterialSource/List?lineWorkID=${ID}` });
  },
  getProductionLinetEquipmentList(ID) { // POST /Api/ProductionLine/Equipment/List  生产线生产工序列表
    return request({ method: 'GET', url: `/Api/ProductionLine/Equipment/List?lineWorkID=${ID}` });
  },
  getProductionLinetMaterialSourceSave(data) { // POST /Api/ProductionLine/MaterialSource/Save  生产线物料来源保存
    return request({ method: 'POST', url: '/Api/ProductionLine/MaterialSource/Save', data });
  },
  getProductionLinetEquipmentSave(data) { // POST /Api/ProductionLine/Equipment/Save  生产线设备保存
    return request({ method: 'POST', url: '/Api/ProductionLine/Equipment/Save', data });
  },

  //

};
export default api;
