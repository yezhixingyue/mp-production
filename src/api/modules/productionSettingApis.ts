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

  //

};
export default api;
