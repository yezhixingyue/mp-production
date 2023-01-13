import { IEquipmentStatusItem } from '@/views/productionManagePages/EquipmentStatus/js/types';
import { IManageChunkInfo } from '@/views/productionManagePages/ManageChunkListPage/js/type';
import { IManagePlateInfo } from '@/views/productionManagePages/ManagePlateListPage/js/type';
import { IManageOrderListItem } from '@/views/productionManagePages/ManageOrderListPage/js/type';
import { IManageTaskListItem } from '@/views/productionManagePages/ManageTaskListPage/js/type';
import request from '../request/request';
import { instance } from '../request/instance';

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
    return request<IManageOrderListItem[]>({ method: 'POST', url: '/Api/Order/List', data: condition });
  },
  /** POST /Api/Plate/List   筛选大版列表 */
  getPlateList(condition) {
    return request<IManagePlateInfo[]>({ method: 'POST', url: '/Api/Plate/List', data: condition });
  },
  /** POST /Api/Chunk/List   筛选块列表 */
  getChunkList(condition) {
    return request<IManageChunkInfo[]>({ method: 'POST', url: '/Api/Chunk/List', data: condition });
  },
  /** POST /Api/Task/List   筛选任务列表 */
  getTaskList(data) {
    return instance.post<IManageTaskListItem[]>('/Api/Task/List', data);
  },
};
