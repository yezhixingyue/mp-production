import { IEquipmentStatusItem } from '@/views/productionManagePages/EquipmentStatus/List/js/types';
import { IManageChunkInfo } from '@/views/productionManagePages/ManageChunkListPage/js/type';
import { IManagePlateInfo } from '@/views/productionManagePages/ManagePlateListPage/js/type';
import { IManageOrderListItem } from '@/views/productionManagePages/ManageOrderListPage/js/type';
// import { IManageTaskListItem } from '@/views/productionManagePages/ManageTaskListPage/js/type';
import { IExternalMaterialDetail } from '@/views/productionManagePages/ManageOutsideMaterialListPage/js/types';
import { IOrderFlowchartNode } from '@/views/productionManagePages/ManageOrderListPage/js/OrderFlowchart/types';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import request from '../request/request';
import { instance } from '../request/instance';

export const productionManageApis = {
  /* 生产管理
  --------------------------------- */
  getEquipmentStatusList(data: { ClassID: number | '' }, closeLoading = false) { // POST 设备状态列表
    return request<IEquipmentStatusItem[]>({
      method: 'POST', url: '/Api/EquipmentStatus/List', data, closeLoading,
    });
  },
  /** POST /Api/Equipment/TaskList   获取设备信息列表 */
  getEquipmentTaskList(data) {
    return instance.post<ITaskDetail[]>('/Api/Equipment/TaskList', data);
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
  /** POST /Api/Task/List   筛选任务列表 --- 接口作废 和 设备任务列表接口共用 */
  // getTaskList(data) {
  //   return instance.post('/Api/Task/List', data);
  // },
  /** POST /Api/MaterialRequisition/List   领料单列表 */
  getMaterialRequisitionList(data) {
    return instance.post('/Api/MaterialRequisition/List', data);
  },
  /** POST /Api/ExternalMaterial/List   外来物料列表 */
  getExternalMaterialList(data) {
    return instance.post<IExternalMaterialDetail[]>('/Api/ExternalMaterial/List', data);
  },
  /** PUT /Api/ExternalMaterial/Received  外来物料到货 */
  getExternalMaterialReceived(id) {
    return instance.put('/Api/ExternalMaterial/Received', null, { params: { id } });
  },
  /** /Api/Order/Distribute  测试使用：用于临时把订单转换为拼版状态 */
  getOrderDistributeWithTest(orderID: string) {
    return instance.get('/Api/Order/Distribute', { params: { orderID } });
  },
  /** GET /Api/Process/List  获取订单、大版、块的流程信息列表 */
  getProcessList(targetID: string, targetType: ReportModeEnum) {
    return instance.get<IOrderFlowchartNode[]>('/Api/Process/List', { params: { targetID, targetType } });
  },
  /** PUT /Api/Order/PushTop  订单置顶 */
  getOrderPushTop(orderID) {
    return instance.put('/Api/Order/PushTop', null, { params: { orderID } });
  },
  /** GET /Api/Order/GetTimeLine  获取订单时间线 */
  getOrderGetTimeLine(orderID: string) {
    return instance.get('/Api/Order/GetTimeLine', { params: { orderID }, closeLoading: true });
  },
  /** GET /Api/Task/UseableEquipmentList  获取任务可用设备列表 taskWorkingID */
  getTaskUseableEquipmentList(taskWorkingID: string) {
    return instance.get('/Api/Task/UseableEquipmentList', { params: { taskWorkingID }, closeLoading: true });
  },
  /** PUT /Api/Task/ChangeEquipment  任务更换设备 */
  getTaskChangeEquipment(taskWorkingID: string, equipmentID: string) {
    return instance.put('/Api/Task/ChangeEquipment', null, { params: { taskWorkingID, equipmentID } });
  },
};
