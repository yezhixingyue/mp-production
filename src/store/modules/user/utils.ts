import { IUserStoreState } from './types';

export const getUserStoreInitialState: () => IUserStoreState = () => ({
  token: '',
  loginTime: '',
  lastReqTime: '',
  user: null,
  getTheUserTime: '',
});

/** 传入最后一次请求时间 获取是否已经过期 */
export const isExpired = (lastReqTime: IUserStoreState['lastReqTime']) => (lastReqTime ? Date.now() > lastReqTime + 24 * 60 * 60 * 1000 : false);
