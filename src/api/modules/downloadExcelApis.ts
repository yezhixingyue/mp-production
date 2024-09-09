import { instance } from '@/basic/request';

export const downloadExcelApis = {
  /* 导出excel表格相关接口 --- 全部导出Excel文件的接口都应放置到该文件设置中，以便于在axios中统一进行处理
  --------------------------------- */
  testExcell(data) { // POST  物料类型查询 --------- 测试数据 后面清除
    return instance.post('/Api/MaterialType/List', data, { responseType: 'arraybuffer', closeTip: true });
  },
  /** POST /Api/ExternalMaterial/Excel  导出外来物料Excel */
  getExternalMaterialExcel(condition) {
    return instance.post('/Api/ExternalMaterial/Excel', condition, { responseType: 'arraybuffer', closeTip: true });
  },
  /** POST /Api/ExternalTask/Excel  外协任务列表 导出Excel */
  getExternalTaskExcel(condition) {
    return instance.post('/Api/ExternalTask/Excel', condition, { responseType: 'arraybuffer', closeTip: true });
  },
  /** POST /Api/Task/Excel   生产任务导出Excel */
  getTaskExcel(condition) {
    return instance.post('/Api/Task/Excel', condition, { responseType: 'arraybuffer', closeTip: true });
  },
  /** 数码工单列表Excel */
  getOfflinePlateExcel(condition) {
    return instance.post('/Api/OfflinePlate/Excel', condition, { responseType: 'arraybuffer', closeTip: true });
  },
  /** 数码完工任务列表Excel /Api/DigitalTask/Excel */
  getDigitalTaskExcel(condition) {
    return instance.post('/Api/DigitalTask/Excel', condition, { responseType: 'arraybuffer', closeTip: true });
  },
  /** POST /Api/Plate/Excel   大版导出Excel */
  getPlateExcel(condition) {
    return instance.post('/Api/Plate/Excel', condition, { responseType: 'arraybuffer', closeTip: true });
  },
};
