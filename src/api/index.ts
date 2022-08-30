import { ILoginSubmitForm, IUser } from '@/store/modules/user/types';
import MaterialStorage from './request/MaterialStorage/index';
import request from './request/request';

const api = {
  getLogin(data: ILoginSubmitForm) { // POST /Api/Staff/Login
    return request<ILoginSubmitForm, null|string>({ method: 'POST', url: '/Api/Staff/Login', data });
  },
  getUser() {
    return request<null, IUser>({ method: 'get', url: '/Api/Customer/Detail' });
  },
  getStaffDetail() {
    return request<null, IUser>({ method: 'get', url: '/Api/Customer/Detail' });
  },
  getDistrictList(ID:number) {
    return request({ method: 'get', url: `/Api/District/List?parentID=${ID}` });
  },

  getStaffSelect() {
    return request({ method: 'GET', url: '/Api/Staff/Select' });
  },
  getUploadImage() {
    return request({ method: 'POST', url: '/Api/Upload/Image' });
  },
  // 物料仓储 api
  ...MaterialStorage,
};

export default api;
