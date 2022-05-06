import { ILoginSubmitForm, IUser } from '@/store/modules/user/types';
import request from './request/request';

const api = {
  getLogin(data: ILoginSubmitForm) { // POST /Api/Staff/Login
    return request<ILoginSubmitForm, null|string>({ method: 'POST', url: '/Api/staff/login', data });
  },
  getUser() {
    return request<null, IUser>({ method: 'get', url: '/Api/Customer/Detail' });
  },
};

export default api;
