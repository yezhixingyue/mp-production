import { IEquipmentErrorInfo, ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { IUndeliveredListItem } from '@/views/ProductionClient/Comps/EquipmentPageContent/FloatingBall/WebsocketHandler';
import { ILoginSubmitForm } from '@/store/modules/user/types';
import { clientInstance as instance } from '../request/client';

const clientApi = {
  getLogin(data: ILoginSubmitForm) { // POST /Api/Staff/Login
    return instance.post('/Api/Staff/Login', data, { withoutToken: true });
  },
  getUser(token?: string) { // POST /Api/Staff/Detail
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return instance.post('/Api/Staff/Detail', { headers });
  },
  getTerminalEquipmentList(terminal: string) { // 获取终端设备列表
    return instance.get('/Api/Terminal/Equipment/List', { params: { terminal }, withoutToken: true });
  },
  getVerifySystemPassword(password: string) { // GET /Api/Verify/SystemPassword   验证系统密码
    return instance.get('/Api/Verify/SystemPassword', { params: { password }, withoutToken: true });
  },
  getEquipmentBind(terminal: string, list: string[], sign: string) { // GET /Api/Equipment/Bind   绑定设备
    const headers = { sign };
    return instance.post('/Api/Equipment/Bind', { terminal, list }, { headers, withoutToken: true });
  },
  /** POST /Api/Equipment/Error   设备报停 */
  getEquipmentStop(data) {
    return instance.post<IEquipmentErrorInfo>('/Api/Equipment/Error', data);
  },
  /** GET /Api/Equipment/StartTask  获取设备当前加工任务信息 - 如果当前没有任务信息则自动开启一个任务 */
  getEquipmentStartTask(equipmentID: string) {
    return instance.get<ITaskDetail>('/Api/Equipment/StartTask', { params: { equipmentID } });
  },
  /** POST /Api/Equipment/Receive   送达 -- 扫描条码枪 */
  getEquipmentReceive(data, msgCallback) {
    return instance.post('/Api/Equipment/Receive', data, { msgCallback });
  },
  /** POST /Api/Task/List   获取设备未开始任务信息列表 */
  getEquipmentTaskList(data) {
    return instance.post('/Api/Task/List', data);
  },
  /** GET /Api/Equipment/Renew   设备恢复生产 */
  getEquipmentRenew(equipmentID: string) {
    return instance.get('/Api/Equipment/Renew', { params: { equipmentID } });
  },
  /** GET /Api/ErrorEquipment/Task  故障设备任务 */
  getErrorEquipmentTask(equipmentID: string) {
    return instance.get<IEquipmentErrorInfo>('/Api/ErrorEquipment/Task', { params: { equipmentID } });
  },
  /** POST /Api/Equipment/TaskReport  报工 */
  getEquipmentReprot(data) {
    return instance.post('/Api/Equipment/TaskReport', data);
  },
  /** POST /Api/Equipment/TaskError   任务异常 */
  getEquipmentTaskError(data: { ID: string, Remark: string }) {
    return instance.post('/Api/Equipment/TaskError', data);
  },
  /** POST /Api/Equipment/TaskBatchReport  批量报工 */
  getEquipmentTaskBatchReport(data) {
    return instance.post('/Api/Equipment/TaskBatchReport', data);
  },
  /** GET Api/Equipment/NextWorkingList */
  getEquipmentNextWorkingList(TaskWorkingID: string) {
    return instance.get('/Api/Equipment/NextWorkingList', { params: { TaskWorkingID } });
  },
  /** GET /Api/Equipment/UndeliveredList  获取设备未送达物料列表 */
  getEquipmentUndeliveredList(terminal: string) {
    return instance.get<IUndeliveredListItem[]>('/Api/Equipment/UndeliveredList', { params: { terminal }, loading: true, closeTip: true, withoutToken: true });
  },
  /** 退出登录 put /Api/Logout  equipmentID */
  getLogout(equipmentID: string) {
    return instance.put('/Api/Logout', null, { params: { equipmentID } });
  },
};

export default clientApi;
