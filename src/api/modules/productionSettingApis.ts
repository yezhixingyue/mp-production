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
  getShiftTimeDetail(id) { // GET /Api/ShiftTime/Detail  发货班次详情
    return request({ method: 'GET', url: `/Api/ShiftTime/Detail?id=${id}` });
  },
  getShiftTimeRemove(id) { // GET /Api/ShiftTime/Remove  发货班次删除
    return request({ method: 'DELETE', url: `/Api/ShiftTime/Remove?id=${id}` });
  },

  // 工序 ------------------------ WorkingProcedure
  getWorkingProcedureList(data) { // POST /Api/WorkingProcedure/List  工序列表
    return request({ method: 'POST', url: '/Api/WorkingProcedure/List', data });
  },
  getWorkingProcedureSearch(searchType) { // POST /Api/WorkingProcedure/Search  工序查询
    return request({ method: 'GET', url: `/Api/WorkingProcedure/Search?searchType=${searchType}` });
  },
  getWorkingProcedureSave(data) { // POST /Api/WorkingProcedure/Save  工序保存
    return request({ method: 'POST', url: '/Api/WorkingProcedure/Save', data });
  },
  getWorkingProcedureRemove(ID) { // POST /Api/WorkingProcedure/Remove  工序删除
    return request({ method: 'DELETE', url: `/Api/WorkingProcedure/Remove?id=${ID}` });
  },

  // 生产线 ------------------------ ProductionLine
  getProductionLinOpen(id) { // POST /Api/ProductionLine/Open  生产线设为可用
    return request({ method: 'GET', url: `/Api/ProductionLine/Open?id=${id}` });
  },
  getProductionLineSave(data) { // POST /Api/ProductionLine/Save  生产线保存
    return request({ method: 'POST', url: '/Api/ProductionLine/Save', data });
  },
  getProductionLineList(data) { // POST /Api/ProductionLine/List  生产线列表
    return request({ method: 'POST', url: '/Api/ProductionLine/List', data });
  },
  getProductionLineRemove(ID) { // POST /Api/ProductionLine/Remove  生产线删除
    return request({ method: 'DELETE', url: `/Api/ProductionLine/Remove?id=${ID}` });
  },
  getProductionLineWorkingProcedureAdd(data) { // POST /Api/ProductionLine/WorkingProcedure/Add  生产线添加工序
    return request({ method: 'POST', url: '/Api/ProductionLine/WorkingProcedure/Add', data });
  },
  getProductionLineWorkingProcedureList(data) { // POST /Api/ProductionLine/WorkingProcedure/List  生产线工序列表
    return request({ method: 'POST', url: '/Api/ProductionLine/WorkingProcedure/List', data });
  },
  getProductionLineWorkingProcedureRemove(lineWorkID) { // POST /Api/ProductionLine/WorkingProcedure/Remove  生产线工序删除
    return request({ method: 'DELETE', url: `/Api/ProductionLine/WorkingProcedure/Remove?lineWorkID=${lineWorkID}` });
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
  getProductionLinetEquipmentRemove(id) { // POST /Api/ProductionLine/Equipment/Remove  生产线设备删除
    return request({ method: 'DELETE', url: `/Api/ProductionLine/Equipment/Remove?id=${id}` });
  },
  getProductionLineSetSplit(data) { // POST /Api/ProductionLine/SetSplit  工序删除
    return request({ method: 'POST', url: '/Api/ProductionLine/SetSplit', data });
  },
  getProductionLinePutOutList(lineEquipmentID) { // POST /Api/ProductionLine/PutOut/List  生产线申放列表
    return request({ method: 'GET', url: `/Api/ProductionLine/PutOut/List?lineEquipmentID=${lineEquipmentID}` });
  },
  getProductionLinePutOutSave(data) { // POST /Api/ProductionLine/PutOut/Save  生产线申放保存
    return request({ method: 'POST', url: '/Api/ProductionLine/PutOut/Save', data });
  },
  getProductionLinePutOutRemove(id) { // POST /Api/ProductionLine/PutOut/Remove  生产线申放删除
    return request({ method: 'DELETE', url: `/Api/ProductionLine/PutOut/Remove?id=${id}` });
  },
  getProductionLineCapacityList(lineEquipmentID) { // POST /Api/ProductionLine/Capacity/List  生产线设备产能列表
    return request({ method: 'GET', url: `/Api/ProductionLine/Capacity/List?lineEquipmentID=${lineEquipmentID}` });
  },
  getProductionLineCapacityRemove(id) { // POST /Api/ProductionLine/Capacity/Remove  生产线设备产能删除
    return request({ method: 'DELETE', url: `/Api/ProductionLine/Capacity/Remove?id=${id}` });
  },
  getProductionLineCapacitySave(data) { // POST /Api/ProductionLine/Capacity/Save  生产线设备产能编辑
    return request({ method: 'POST', url: '/Api/ProductionLine/Capacity/Save', data });
  },
  //

};
export default api;
