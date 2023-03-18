import { IExternalReportResult } from '@/views/OutsourceManage/ExternalReceiveManage/js/types';
import { instance } from '../request/instance';

/**
 * 外协管理模块接口
 */
export const outsourceApis = {
  /** POST /Api/ExternalTask/List  筛选外协任务列表 */
  getExternalTaskList(data) {
    return instance.post('/Api/ExternalTask/List', data);
  },
  /** POST /Api/ExternalFactory/TakeOrder  外协工厂接单 */
  getExternalFactoryTakeOrder(data) {
    return instance.post('/Api/ExternalFactory/TakeOrder', data);
  },
  /** PUT /Api/ExternalFactory/Revocation  外协工厂撤销任务 */
  getExternalFactoryRevocation(id: string) {
    return instance.put('/Api/ExternalFactory/Revocation', null, { params: { id } });
  },
  /** POST /Api/ExternalFactory/Download 外协任务下载 */
  getExternalFactoryDownload(data: { List: { TaskID: string }[] }) {
    return instance.post('/Api/ExternalFactory/Download', data);
  },
  /** GET /Api/ExternalFactory/ReportDetail 外协加工入库详情 */
  getExternalFactoryReportDetail(taskCode: number, msgCallback) {
    return instance.get<IExternalReportResult>('/Api/ExternalFactory/ReportDetail', { params: { taskCode }, msgCallback });
  },
  /** PUT /Api/ExternalFactory/TaskReport   外协加工入库 */
  getExternalFactoryTaskReport(taskCode: number) {
    return instance.put<string>('/Api/ExternalFactory/TaskReport', null, { params: { taskCode } });
  },
  /** POST /Api/Equipment/TaskError   任务异常 -- 外协任务提交问题 */
  getEquipmentTaskError(data: { ID: string, Remark: string }) {
    return instance.post('/Api/Equipment/TaskError', data);
  },
};
