import { IDistrictItem } from '@/assets/Types/common';
import { ILoginSubmitForm, IUser } from '@/store/modules/user/types';
import { resourceApis } from './modules/resourceApis';
import { propertyApis } from './modules/propertyApis';
import MaterialStorage from './modules/materialStorageApis';
import PasteupSetting from './modules/pasteupSettingApis';
import { companyApis } from './modules/companyApis';
import { otherSettingApis } from './modules/otherApis';
import request from './request/request';

const api = {
  getLogin(data: ILoginSubmitForm) { // POST /Api/Staff/Login
    return request<ILoginSubmitForm, null|string>({ method: 'POST', url: '/Api/Staff/Login', data });
  },
  getUser() {
    return request<null, IUser>({ method: 'post', url: '/Api/Staff/Detail' });
  },
  getDistrictList(ID?:number) {
    return request<number, IDistrictItem[]>({ method: 'get', url: '/Api/District/List', params: { parentID: ID } });
  },

  getStaffSelect() {
    return request({ method: 'GET', url: '/Api/Staff/Select' });
  },
  getUploadImage() {
    return request({ method: 'POST', url: '/Api/Upload/Image' });
  },
  // 修改密码
  getStaffChangePassword(data) {
    return request({ method: 'POST', url: '/Api/Upload/Image', data });
  },
  // 物料仓储 api
  ...MaterialStorage,
  // 生产资源 api
  ...resourceApis,
  // 拼版设置 api
  ...PasteupSetting,
  // 属性相关 api
  propertyApis,
  // 其它设置 api
  ...otherSettingApis,
  // 公司管理 api
  ...companyApis,
};

export default api;
