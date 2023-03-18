import { IDistrictItem } from '@/assets/Types/common';
import { ILoginSubmitForm, IUser } from '@/store/modules/user/types';
import { resourceApis } from './modules/resourceApis';
import { propertyApis } from './modules/propertyApis';
import MaterialStorage from './modules/materialStorageApis';
import PasteupSetting from './modules/pasteupSettingApis';
import { companyApis } from './modules/companyApis';
import { downloadExcelApis } from './modules/downloadExcelApis';
import { otherSettingApis } from './modules/otherApis';
import { productionManageApis } from './modules/productionManageApis';
import { ManualOrderHandlerApis } from './modules/ManualOrderHandlerApis';
import { clientApis } from './modules/clientApis';
import { ExceptionHandlerApis } from './modules/ExceptionHandlerApis';
import { outsourceApis } from './modules/outsourceApis';
import productionSetting from './modules/productionSettingApis';
import request from './request/request';

const api = {
  getLogin(data: ILoginSubmitForm) { // POST /Api/Staff/Login
    return request<null|string>({ method: 'POST', url: '/Api/Staff/Login', data });
  },
  getUser(token?: string) {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return request<IUser>({ method: 'post', url: '/Api/Staff/Detail', headers });
  },
  getDistrictList(ID?:number) {
    return request<IDistrictItem[]>({ method: 'get', url: '/Api/District/List', params: { parentID: ID } });
  },

  getStaffSelect() {
    return request({ method: 'GET', url: '/Api/Staff/Select' });
  },
  getImageUpload(data, type = 1) {
    const formData = new FormData();
    formData.append('file', data);
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const params = { type };
    return request({
      method: 'POST', url: '/Api/Upload/Image', data: formData, params, headers,
    });
  },
  // 修改密码
  getStaffChangePassword(data) {
    return request({ method: 'POST', url: '/Api/Staff/ChangePassword', data });
  },
  // 物料仓储 api
  ...MaterialStorage,
  // 生产资源 api
  ...resourceApis,
  // 拼版设置 api
  ...PasteupSetting,
  // 生产设置 api
  ...productionSetting,
  /** 属性相关 api */
  propertyApis,
  // 其它设置 api
  ...otherSettingApis,
  // 公司管理 api
  ...companyApis,
  /** 全部导出excel表格 api */
  downloadExcelApis,
  /** 生产管理 api */
  productionManageApis,
  /** 手动下单 api */
  ManualOrderHandlerApis,
  /** 生产报工客户端 api */
  clientApis,
  /** 异常处理接口 */
  ExceptionHandlerApis,
  /** 外协管理相关接口 */
  outsourceApis,
};

export default api;
