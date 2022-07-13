import { defineStore, DefineStoreOptions } from 'pinia';
import api from '@/api';
import { ILoginSubmitForm, IUser } from './types';

interface IState {
  user: IUser | null
  token: string
  loginTime: '' | number
  getUserTime: '' | number
}

type IGetters = Record<string, never>;

interface IActions {
  getLogin: (loginForm: ILoginSubmitForm) => Promise<boolean>;
  getUser: () => void;
}

const options: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'user',
  state: () => ({
    user: null,
    token: '',
    loginTime: '',
    getUserTime: '',
  }),
  getters: {
  },
  actions: {
    async getLogin(loginForm: ILoginSubmitForm) {
      const resp = await api.getLogin(loginForm).catch(() => null);
      if (resp && resp.data.isSuccess && resp.data.Data) {
        this.token = resp.data.Data;
        this.loginTime = Date.now();
        this.user = null;
        this.getUserTime = '';
        return true;
      }
      return false;
    },
    async getUser() {
      if (this.user && this.user.Account.Token === this.token) return;
      this.user = null;
      if (!this.token) return;
      const resp = await api.getUser().catch(() => null);
      if (!resp || !resp.data.isSuccess) return;
      this.user = resp.data.Data;
      this.getUserTime = Date.now();
    },
  },
  persist: {
    key: 'my_user', // 自定义缓存中的key键名
    storage: localStorage, // 自定义缓存类型，默认sessionStorage，
    paths: ['user', 'token', 'loginTime', 'getUserTime'], // 自定义指定持久化的字段，默认为全部
    serializer: {
      serialize: JSON.stringify,
      deserialize: (e) => {
        const temp = JSON.parse(e);
        if (temp && typeof temp === 'object') {
          const { loginTime, getUserTime } = temp;
          if (loginTime && Date.now() - loginTime > 30 * 24 * 60 * 60 * 1000) {
            return {
              user: null,
              token: '',
              loginTime: '',
            };
          }
          if (getUserTime && Date.now() - getUserTime > 8 * 60 * 60 * 1000) {
            return { ...temp, user: null };
          }
        }
        return JSON.parse(e);
      },
    },
  },
};

export const useUserStore = defineStore(options);
