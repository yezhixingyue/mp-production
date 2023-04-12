import { IEquipmentErrorInfo, ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { clientInstance as instance } from './clientInstance';

const clientApi = {
  getTerminalEquipmentList(terminal: string) { // 获取终端设备列表
    return instance.get('/Api/Terminal/Equipment/List', { params: { terminal } });
  },
  getVerifySystemPassword(password: string) { // GET /Api/Verify/SystemPassword   验证系统密码
    return instance.get('/Api/Verify/SystemPassword', { params: { password } });
  },
  getEquipmentBind(terminal: string, list: string[], sign: string) { // GET /Api/Equipment/Bind   绑定设备
    const headers = { sign };
    return instance.post('/Api/Equipment/Bind', { terminal, list }, { headers });
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
  /** POST /Api/Equipment/TaskList   获取设备未开始任务信息列表 */
  getEquipmentTaskList(data) {
    return instance.post('/Api/Equipment/TaskList', data);
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
  /** GET /Api/Staff/LoginOut  员工退出登录 -目前仅报工使用 */
  getStaffLoginOut(equipmentID: string) {
    return instance.get('/Api/Staff/LoginOut', { params: { equipmentID } });
  },
  /** POST /Api/Equipment/TaskBatchReport  批量报工 */
  getEquipmentTaskBatchReport(data) {
    return instance.post('/Api/Equipment/TaskBatchReport', data);
  },
  /** GET Api/Equipment/NextWorkingList */
  getEquipmentNextWorkingList(TaskWorkingID: string) {
    return instance.get('Api/Equipment/NextWorkingList', { params: { TaskWorkingID } });
  },
};

export default clientApi;
