import { IEquipmentStatusItem } from '@/views/productionManagePages/EquipmentStatus/List/js/types';
import { IManageChunkInfo } from '@/views/productionManagePages/ManageChunkListPage/js/type';
import { IManagePlateInfo } from '@/views/productionManagePages/ManagePlateListPage/js/type';
import { IManageOrderListItem, IOrderCancelRelation } from '@/views/productionManagePages/ManageOrderListPage/js/type';
// import { IManageTaskListItem } from '@/views/productionManagePages/ManageTaskListPage/js/type';
import { IExternalMaterialDetail } from '@/views/productionManagePages/ManageOutsideMaterialListPage/js/types';
import { IOrderFlowchartNode } from '@/components/common/NodePicDialog/js/types';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { IDigitalOrderPlatePrintInfo } from '@/views/productionManagePages/ManageDigitalListPage/js/types';
import { request, instance } from '@/basic/request';
import { IChunkDetail } from '@/views/productionManagePages/TagRePrintPage/js/type';

export const productionManageApis = {
  /* 生产管理
  --------------------------------- */
  getEquipmentStatusList(data: { ClassID: number | '' }, loading: boolean) { // POST 设备状态列表
    return request<IEquipmentStatusItem[]>({
      method: 'POST', url: '/Api/EquipmentStatus/List', data, loading,
    });
  },
  /** POST /Api/Task/List   获取设备信息列表 */
  getEquipmentTaskList(data) {
    return instance.post<ITaskDetail[]>('/Api/Task/List', data);
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
  /** get /Api/Plate/Detail */
  getPlateDetail(plateID: string) {
    return instance.get<IDigitalOrderPlatePrintInfo>('/Api/Plate/Detail', { params: { plateID } });
  },
  /** POST /Api/Chunk/List   筛选块列表 */
  getChunkList(condition) {
    return request<IManageChunkInfo[]>({ method: 'POST', url: '/Api/Chunk/List', data: condition });
  },
  /** GET /Api/Plate/OrderList  获取大版相关订单列表 */
  getPlateOrderList(plateID: string) {
    return instance.get<IManageOrderListItem[]>('/Api/Plate/OrderList', { params: { plateID } });
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
  getProcessList(targetID: string | number, targetType: ReportModeEnum) {
    return instance.get<IOrderFlowchartNode[]>('/Api/Process/List', { params: { targetID, targetType } });
  },
  /** PUT /Api/Order/PushTop  订单置顶 */
  getOrderPushTop(orderID) {
    return instance.put('/Api/Order/PushTop', null, { params: { orderID } });
  },
  /** GET /Api/Order/GetTimeLine  获取订单时间线 */
  getOrderGetTimeLine(orderID: string) {
    return instance.get('/Api/Order/GetTimeLine', { params: { orderID }, loading: false });
  },
  /** GET /Api/Order/CancleRelation  获取订单取消相关 */
  getOrderCancleRelation(orderID: string) {
    return instance.get<IOrderCancelRelation>('/Api/Order/CancleRelation', { params: { orderID }, loading: false });
  },
  /** POST /Api/Order/Cancle  订单取消 */
  getOrderCancle(data) {
    return instance.post('/Api/Order/Cancle', data);
  },
  /** GET /Api/Task/UseableEquipmentList  获取任务可用设备列表 taskWorkingID */
  getTaskUseableEquipmentList(taskWorkingID: string) {
    return instance.get('/Api/Task/UseableEquipmentList', { params: { taskWorkingID }, loading: false });
  },
  /** PUT /Api/Task/ChangeEquipment  任务更换设备 */
  getTaskChangeEquipment(taskWorkingID: string, equipmentID: string) {
    return instance.put('/Api/Task/ChangeEquipment', null, { params: { taskWorkingID, equipmentID } });
  },
  /** 获取数码工单打印列表数据 POST /Api/OfflinePlate/List 线下大版列表 */
  getOfflinePlateList(condition) {
    return instance.post('/Api/OfflinePlate/List', condition);
  },
  /** POST /Api/OfflinePlate/Print  线下大版打印工单 */
  getOfflinePlatePrint(data: { List: number[]; IsPrint: boolean }) {
    return instance.post<IDigitalOrderPlatePrintInfo[]>('/Api/OfflinePlate/Print', data);
  },
  /** 导出大版 PUT /Api/PlateFile/Retransfer  orderID */
  getPlateFileRetransfer(orderID: string) {
    return instance.put('/Api/PlateFile/Retransfer', null, { params: { orderID } });
  },
  /** 撤回数码大版 /Api/OfflinePlate/Revocation */
  getOfflinePlateRevocation(data) {
    return instance.post('/Api/OfflinePlate/Revocation', data);
  },
  /** POST /Api/DigitalTask/List  数码已完工任务 */
  getDigitalTaskList(condition) {
    return instance.post('/Api/DigitalTask/List', condition);
  },
  /** /Api/Chunk/Detail 获取块详情 补打块标签  */
  getChunkDetail(code: string) {
    return instance.get<IChunkDetail>('/Api/Chunk/Detail', { params: { code } });
  },
};
