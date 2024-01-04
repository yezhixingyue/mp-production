import { ITaskExceptionHandlingDetail } from '@/views/ExceptionManage/_ExceptionCommonViews/DetailView/js/type';
import { ITaskExceptionDetail, ITaskExceptionInfo } from '@/views/ExceptionManage/_ExceptionCommonViews/js/type';
import { IRevocationChunk } from '@/views/ExceptionManage/_ExceptionCommonViews/SetupView/js/type';
import { ISchedulingExceptionListItem } from '@/views/ExceptionManage/ScheduleException/js/type';
import { instance } from '../request/instance';

/**
 * 异常处理模块接口
 */
export const ExceptionHandlerApis = {
  /** POST /Api/ProductionException/List  获取生产异常列表 */
  getProductionExceptionList(data) {
    return instance.post<ITaskExceptionInfo[]>('/Api/ProductionException/List', data);
  },

  /** GET /Api/ProductionException/Detail   获取任务异常详情 -- 用于异常处理 */
  getProductionExceptionDetail(id) {
    return instance.get<ITaskExceptionDetail>('/Api/ProductionException/Detail', { params: { id } });
  },

  /** POST /Api/ProductionException/Handling  生产异常处理 */
  getProductionExceptionHandling(data) {
    return instance.post('/Api/ProductionException/Handling', data);
  },

  /** POST /Api/Plate/ChunkList   获取大版上指定订单块信息; 多个ID使用半角逗号（，）隔开，最多可填写10个订单 */
  getPlateChunkList(data: { ID: string, OrderCodeListString: string, CurrentTaskOrderID?: string }) {
    return instance.post<IRevocationChunk[]>('/Api/Plate/ChunkList', data);
  },

  /** GET /Api/ProductionException/DealDetail  获取任务异常处理详情 */
  getProductionExceptionDealDetail(id: string) {
    return instance.get<ITaskExceptionHandlingDetail>('/Api/ProductionException/DealDetail', { params: { id } });
  },

  /** POST /Api/SchedulingException/List  排程异常列表 */
  getSchedulingExceptionList(condition) {
    return instance.post<ISchedulingExceptionListItem[]>('/Api/SchedulingException/List', condition);
  },
  /** POST /Api/SchedulingException/Deal  排程异常处理 */
  getSchedulingExceptionDeal(List: number[]) {
    // return new Promise((resolve, reject) => {
    //   if (Math.random() > 0.1) resolve({ data: { isSuccess: true } });
    //   else reject(new Error('123'));
    // });
    return instance.post('/Api/SchedulingException/Deal', { List });
  },
};
