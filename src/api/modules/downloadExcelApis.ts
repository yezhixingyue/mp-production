import { instance } from '../request/instance';

export const downloadExcelApis = {
  /* 导出excel表格相关接口 --- 全部导出Excel文件的接口都应放置到该文件设置中，以便于在axios中统一进行处理
  --------------------------------- */
  testExcell(data) { // POST /Api/Staff/Login  物料类型查询 --------- 测试数据 后面清除
    return instance.post('/Api/MaterialType/List', data, { responseType: 'arraybuffer' });
  },
  /** POST /Api/ExternalMaterial/Excel  导出外来物料Excel */
  getExternalMaterialExcel(condition) {
    return instance.post('/Api/ExternalMaterial/Excel', condition, { responseType: 'arraybuffer' });
  },
  /** POST /Api/ExternalTask/Excel  外协任务列表 导出Excel */
  getExternalTaskExcel(condition) {
    return instance.post('/Api/ExternalTask/Excel', condition, { responseType: 'arraybuffer' });
  },
};

/** 存放导出Excel所有用到的接口路径 -- 此处必须把上面所有的接口url放置到里面 - axios需要特殊处理 */
export const downloadExcelApiUrls: string[] = [
  '/Api/MaterialType/List', // --------- 测试数据 后面清除
  '/Api/ExternalMaterial/Excel', // 外来物料导出
  '/Api/ExternalTask/Excel', // 外协列表
];

if (Object.keys(downloadExcelApis).length !== downloadExcelApiUrls.length) {
  throw new Error('downloadExcelApis与downloadExcelApiUrls数量不一致，请检查是否有遗漏');
}
