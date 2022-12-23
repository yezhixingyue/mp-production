import { IEquipmentStatusItem } from '@/views/productionManagePages/EquipmentStatus/js/types';
import request from '../request/request';

export const productionManageApis = {
  /* 生产管理
  --------------------------------- */
  getEquipmentStatusList(data: { ClassID: number | '' }) { // POST 设备状态列表
    return request<IEquipmentStatusItem[]>({ method: 'POST', url: '/Api/EquipmentStatus/List', data });
  },
};
