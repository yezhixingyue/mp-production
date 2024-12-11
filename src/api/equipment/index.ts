import { instance } from '@/basic/request';
import { equipmentURL as baseURL, siteType } from '@/config';

/** 设备管理接口 */
export const mpEquipmentApi = {
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

  getEquipmentSave(data) {
    return instance.post('/api/equipment/save', data, { baseURL, headers: { siteType } });
  },
  getEquipmentList(condition) {
    return instance.post('/api/equipment/list', condition, { baseURL, headers: { siteType } });
  },
  getEquipmentHistoryList(condition) {
    return instance.post('/api/equipment/history', condition, { baseURL, headers: { siteType } });
  },
  getEquipmentChangeState(data) {
    return instance.post('/api/equipment/changeState', data, { baseURL, headers: { siteType } });
  },
  getEquipmentListExcel(condition) {
    return instance.post('/api/equipment/excel', condition, { baseURL, headers: { siteType } });
  },

};
