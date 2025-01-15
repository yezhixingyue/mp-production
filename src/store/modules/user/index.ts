import { defineStore, DefineStoreOptions } from 'pinia';
import api from '@/api';
import { ILoginSubmitForm, IUserStoreActions, IUserStoreGetters, IUserStoreState } from './types';
import { getUserStoreInitialState, isExpired } from './utils';

const options: DefineStoreOptions<string, IUserStoreState, IUserStoreGetters, IUserStoreActions> = {
  id: 'user',
  state: () => getUserStoreInitialState(),
  getters: {
  },
  actions: {
    async getLogin(loginForm: ILoginSubmitForm) {
      const resp = await api.getLogin(loginForm).catch(() => null);

      if (resp && resp.data?.isSuccess && resp.data.Data) {
        this.clear();
        this.token = resp.data.Data;
        this.loginTime = Date.now();
        this.lastReqTime = Date.now();

        return true;
      }

      return false;
    },
    async getUser() {
      if (this.user && this.user.Account.Token === this.token) return null;

      this.user = null;
      if (!this.token) return 'login';

      const resp = await api.getUser();
      if (!resp || !resp.data?.isSuccess) {
        if (resp?.status === 401) {
          return 'login';
        }

        return null;
      }

      this.user = resp.data.Data;
      this.getTheUserTime = Date.now();

      return resp.data.Data;
    },
    clear() {
      const _initialState = getUserStoreInitialState();

      Object.keys(_initialState).forEach((key) => {
        this[key as keyof IUserStoreState] = _initialState[key];
      });
    },
    getToken() {
      let { token } = this;

      if (token) {
        if (isExpired(this.lastReqTime)) { // 过期
          this.clear();
          token = '';
        } else {
          this.lastReqTime = Date.now(); // 未过期 更新最后请求时间
        }
      }

      return token;
    },
  },
  persist: {
    // key: process.env.VUE_APP_TARGET === 'My Order App' ? 'my_prod-order_user' : 'my_prod_user', // 自定义缓存中的key键名
    key: 'my_prod_user', // 自定义缓存中的key键名
    storage: localStorage, // 自定义缓存类型，默认sessionStorage，
    paths: ['user', 'token', 'loginTime', 'getTheUserTime', 'lastReqTime'], // 自定义指定持久化的字段，默认为全部
    serializer: {
      serialize: JSON.stringify,
      deserialize: (e) => {
        const temp = JSON.parse(e);
        if (temp && typeof temp === 'object') {
          if (isExpired(temp.lastReqTime)) {
            return getUserStoreInitialState();
          }
          if (temp.getTheUserTime && Date.now() - temp.getTheUserTime > 8 * 60 * 60 * 1000) {
            return { ...temp, user: null };
          }
        }
        return JSON.parse(e);
      },
    },
  },
};

export const useUserStore = defineStore(options);
