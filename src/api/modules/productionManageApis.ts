import { IEquipmentStatusItem } from '@/views/productionManagePages/EquipmentStatus/js/types';
import { IManageChunkInfo } from '@/views/productionManagePages/ManageChunkListPage/js/type';
import { IManagePlateInfo } from '@/views/productionManagePages/ManagePlateListPage/js/type';
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
  /** POST /Api/Plate/List   筛选大版列表 */
  getPlateList(condition) {
    return request<IManagePlateInfo[]>({ method: 'POST', url: '/Api/Plate/List', data: condition });
  },
  /** POST /Api/Chunk/List   筛选块列表 */
  getChunkList(condition) {
    return request<IManageChunkInfo[]>({ method: 'POST', url: '/Api/Chunk/List', data: condition });
  },
};
