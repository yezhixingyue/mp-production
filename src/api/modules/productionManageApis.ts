import { IEquipmentStatusItem } from '@/views/productionManagePages/EquipmentStatus/js/types';
import { IManageOrderInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import request from '../request/request';

export const productionManageApis = {
  /* 生产管理
  --------------------------------- */
  getEquipmentStatusList(data: { ClassID: number | '' }) { // POST 设备状态列表
    return request<IEquipmentStatusItem[]>({ method: 'POST', url: '/Api/EquipmentStatus/List', data });
  },
  /* 订单列表
  --------------------------------- */
  /** POST /Api/Order/List   筛选订单列表 */
  getOrderList(condition) {
    return request<IManageOrderInfo[]>({ method: 'POST', url: '/Api/Order/List', data: condition });
  },
};
