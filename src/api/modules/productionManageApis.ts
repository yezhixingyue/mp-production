import request from '../request/request';

export const productionManageApis = {
  /* 生产管理
  --------------------------------- */
  getEquipmentStatusList(data) { // POST 设备状态列表
    return request({ method: 'POST', url: '/Api/EquipmentStatus/List', data });
  },
};
