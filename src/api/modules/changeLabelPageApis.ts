import { IGetOrderInfo, IPrintResponse } from '@/views/ChangeLabelPage/types';
import { request } from '@/basic/request';

export const changeLabelPageApis = {
  /* 公司管理相关接口
  --------------------------------- */
  getPrintExpressGetOrderInfo(code) { // /Api/PrintExpress/GetOrderInfo 获取订单信息
    return request<IGetOrderInfo>({ method: 'GET', url: '/Api/PrintExpress/GetOrderInfo', params: { code } });
  },
  getPrintExpressList(data) { // /Api/PrintExpress/List  获取已打印列表
    return request<IGetOrderInfo[]>({ method: 'POST', url: '/Api/PrintExpress/List', data });
  },
  getPrintExpressPrint(data) { // /Api/PrintExpress/Print  打印
    return request<IPrintResponse[]>({ method: 'POST', url: '/Api/PrintExpress/Print', data });
  },
  getOrderRevocation(id) { // delete /Api/PrintExpress/Order/Revocation 撤销打包
    return request({ method: 'delete', url: '/Api/PrintExpress/Order/Revocation', params: { id } });
  },
  getPackageRevocation(id, serverID) { // delete /Api/PrintExpress/Package/Revocation 撤销包裹
    return request({ method: 'delete', url: '/Api/PrintExpress/Package/Revocation', params: { id, serverID } });
  },
};
