import { IProductionLineDetail } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';
import { IFactoryMaterialList } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import request from '../request/request';

export const ManualOrderHandlerApis = {
  /* 手工下单
  --------------------------------- */
  getCreateOrder(data) { // POST /Api/CreateOrder  手动下单
    return request({ method: 'POST', url: '/Api/CreateOrder', data });
  },
  /** GET /Api/Material/All 生产线取物料 */
  getFactoryMaterialList(typeID: string) {
    return request<IFactoryMaterialList[]>({ method: 'GET', url: '/Api/Material/All', params: { typeID } });
  },
  /** 获取生产线详细信息 GET /Api/ProductionLine/Detail */
  getProductionLineDetail(id: string) {
    return request<IProductionLineDetail>({ method: 'GET', url: '/Api/ProductionLine/Detail', params: { id } });
  },
};
