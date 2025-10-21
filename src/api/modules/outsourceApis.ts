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
  /** post /Api/ExternalFactory/ChangePrice/Import  批量导入修改价格 */
  getExternalFactoryChangePriceImport(data) {
    const formData = new FormData();
    formData.append('file', data);
    return instance.post('/Api/ExternalFactory/ChangePrice/Import', formData);
  },
  /** post /Api/ExternalTask/ChangePrice/Template 下载批量修改金额模板 */
  getExternalTaskChangePriceTemplate() {
    return instance.post('/Api/ExternalTask/ChangePrice/Template', null, { responseType: 'arraybuffer', closeTip: true });
  },
  /** get /Api/Staff/OutsourceManagerList  获取外协主管列表 */
  getStaffOutsourceManagerList() {
    return instance.get('/Api/Staff/OutsourceManagerList');
  },
  /** put /Api/Staff/SetOutsourceManager 设置为外协主管 */
  getStaffSetOutsourceManager(staffID: string) {
    return instance.put('/Api/Staff/SetOutsourceManager', null, { params: { staffID } });
  },
  /** delete /Api/Staff/RemoveOutsourceManager 外协主管移除  */
  getStaffRemoveOutsourceManager(staffID: string) {
    return instance.delete('/Api/Staff/RemoveOutsourceManager', { params: { staffID } });
  },
  /** post /Api/ExternalFactory/PriceCheckList 获取外协金额修改列表 */
  getExternalFactoryPriceCheckList(data) {
    return instance.post('/Api/ExternalFactory/PriceCheckList', data);
  },
  /** get /Api/ExternalFactory/GetRecheckerList 获取财务复核人列表 */
  getExternalFactoryGetRecheckerList() {
    return instance.get('/Api/ExternalFactory/GetRecheckerList');
  },
  /** delete /Api/ExternalFactory/ChangePrice/Remove 删除任务修改价格 */
  getExternalFactoryChangePriceRemove(id: number) {
    return instance.delete('/Api/ExternalFactory/ChangePrice/Remove', { params: { id } });
  },
  /** post /Api/ExternalFactory/ChangePrice/Change 修改任务修改价格 */
  getExternalFactoryChangePriceChange(data) {
    return instance.post('/Api/ExternalFactory/ChangePrice/Change', data);
  },
  /** post /Api/ExternalFactory/ChangePrice/ManagerCheck 外协主管审核 */
  getExternalFactoryChangePriceManagerCheck(data) {
    return instance.post('/Api/ExternalFactory/ChangePrice/ManagerCheck', data);
  },
  /** post /Api/ExternalFactory/ChangePrice/Recheck 财务确认 */
  getExternalFactoryChangePriceRecheck(data) {
    return instance.post('/Api/ExternalFactory/ChangePrice/Recheck', data);
  },
  /** get /Api/ExternalFactory/RePrint 补打外协单 */
  getExternalFactoryRePrint(code: string) {
    return instance.get('/Api/ExternalFactory/RePrint', { params: { code }, closeTip: true });
  },
};
