import { IExternalReportResult } from '@/views/OutsourceManage/ExternalReceiveManage/js/types';
import { instance } from '@/basic/request';

/**
 * 外协管理模块接口
 */
export const outsourceApis = {
  /** POST /Api/ExternalTask/List  筛选外协任务列表 */
  getExternalTaskList(data) {
    return instance.post('/Api/ExternalTask/List', data, { encrypt: true });
  },
  /** POST /Api/ExternalFactory/TakeOrder  外协工厂接单 */
  getExternalFactoryTakeOrder(data) {
    return instance.post('/Api/ExternalFactory/TakeOrder', data, { encrypt: true });
  },
  /** PUT /Api/ExternalFactory/Revocation  外协工厂撤销任务 */
  getExternalFactoryRevocation(id: string) {
    return instance.put('/Api/ExternalFactory/Revocation', null, { params: { id }, encrypt: true });
  },
  /** POST /Api/ExternalFactory/Download 外协任务下载 */
  getExternalFactoryDownload(data: { List: { TaskID: string }[] }) {
    return instance.post('/Api/ExternalFactory/Download', data);
  },
  /** GET /Api/ExternalFactory/ReportDetail 外协加工入库详情 */
  getExternalFactoryReportDetail(taskCode: number, isReport: boolean, msgCallback) {
    return instance.get<IExternalReportResult>('/Api/ExternalFactory/ReportDetail', { params: { taskCode, isReport }, msgCallback });
  },
  /** PUT /Api/ExternalFactory/TaskPutOut   外协加工出库 */
  getExternalFactoryTaskPutOut(taskCode: number) {
    return instance.put<string>('/Api/ExternalFactory/TaskPutOut', null, { params: { taskCode }, encrypt: true });
  },
  /** PUT /Api/ExternalFactory/TaskReport   外协加工入库 */
  getExternalFactoryTaskReport(taskCode: number) {
    return instance.put<string>('/Api/ExternalFactory/TaskReport', null, { params: { taskCode }, encrypt: true });
  },
  /** POST /Api/Equipment/TaskError   任务异常 -- 外协任务提交问题 */
  getEquipmentTaskError(data: { ID: string, Remark: string }) {
    return instance.post('/Api/Equipment/TaskError', data);
  },
  /** GET Api/Equipment/NextWorkingList */
  getEquipmentNextWorkingList(TaskWorkingID: string) {
    return instance.get('/Api/Equipment/NextWorkingList', { params: { TaskWorkingID } });
  },
  /** get /Api/ExternalTask/ModifyProcessInfo/List  获取外协任务加工信息修改列表 */
  getExternalTaskModifyProcessInfoList(taskWorkingID: string) {
    return instance.get('/Api/ExternalTask/ModifyProcessInfo/List', { params: { taskWorkingID } });
  },
  /** post /Api/ExternalTask/ModifyProcessInfo  修改加工内容 */
  getExternalTaskModifyProcessInfo(data) {
    return instance.post('/Api/ExternalTask/ModifyProcessInfo', data);
  },
};
