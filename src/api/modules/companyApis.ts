import request from '../request/request';

export const companyApis = {
  /* 公司管理相关接口
  --------------------------------- */
  /** GET /Api/Job/List  获取岗位列表 */
  getJobPermissionsList() {
    return request({ method: 'GET', url: '/Api/Job/List' });
  },
  /** 获取岗位权限详情 POST /Api/Job/Info */
  getJobPermissionsDetail(PositionID: string) {
    return request({ method: 'POST', url: '/Api/Job/Info', data: { PositionID } });
  },
  /** 岗位保存 POST /Api/Job/Save */
  getJobSave(data) {
    return request({ method: 'POST', url: '/Api/Job/Save', data });
  },
  /** POST /Api/JobPermission/Save 岗位权限保存 */
  getJobPermissionSave(data) {
    return request({ method: 'POST', url: '/Api/JobPermission/Save', data });
  },
  getStaffList(data) { // 获取员工信息列表
    return request({ method: 'POST', url: '/Api/Staff/List', data });
  },
  getStaffBaseInfoSave(data) { // /Api/StaffBaseInfo/Save 保存员工信息
    return request({ method: 'POST', url: '/Api/StaffBaseInfo/Save', data });
  },
  getStaffRemove(staffID) { // delete /Api/Staff/Remove 员工删除
    return request({ method: 'delete', url: '/Api/Staff/Remove', params: { staffID } });
  },
  getStaffChangeStatus(data) { // PUT /Api/Staff/ChangeStatus  员工离职|取消离职
    return request({ method: 'put', url: '/Api/Staff/ChangeStatus', data });
  },
  getCheckStaffPassed(data) { // POST /Api/CheckStaff/Passed  审核员工或修改员工岗位部门信息
    return request({ method: 'POST', url: '/Api/CheckStaff/Passed', data });
  },
  getDepartmentList() { //  获取部门列表数据
    return request({ method: 'GET', url: '/Api/Department/List' });
  },
  getDepartmentSave(data) { //  部门保存
    return request({ method: 'POST', url: '/Api/Department/Save', data });
  },
  getDepartmentOrder(data) { //  部门排序保存
    return request({ method: 'POST', url: '/Api/Department/Order', data });
  },
  getIntranetContent() { // /Api/Intranet  获取当前内网IP数据
    return request({ method: 'get', url: '/Api/Intranet' });
  },
  getIntranetSetup(data) { // /Api/Intranet/Setup  设置网络访问IP { Content: '' }
    return request({ method: 'POST', url: '/Api/Intranet/Setup', data });
  },
};
