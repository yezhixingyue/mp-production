import { instance } from '@/basic/request';
import { equipmentURL as baseURL, siteType } from '@/config';

/** 设备管理接口 */
export const mpEquipmentApi = {
  /** 获取分类列表 GET /Api/Category/GetAl */
  getComputerSave(data) {
    return instance.post('/api/computer/save', data, { baseURL, headers: { siteType } });
  },
  getComputerList(condition) {
    return instance.post('/api/computer/list', condition, { baseURL, headers: { siteType } });
  },
  getComputerListExcel(condition) {
    return instance.post('/api/computer/excel', condition, { baseURL, headers: { siteType } });
  },
  getComputerHistoryList(condition) {
    return instance.post('/api/computer/history', condition, { baseURL, headers: { siteType } });
  },
  getComputerChangeState(data) {
    return instance.post('/api/computer/changeState', data, { baseURL, headers: { siteType } });
  },
};
