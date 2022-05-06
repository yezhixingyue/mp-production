import { defineStore, DefineStoreOptions } from 'pinia';
import api from '@/api';
import { ILoginSubmitForm, IUser } from './types';

interface IState {
  user: IUser | null,
  token: string,
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
  }),
  getters: {
  },
  actions: {
    async getLogin(loginForm: ILoginSubmitForm) {
      const resp = await api.getLogin(loginForm).catch(() => null);
      if (resp && resp.data.isSuccess && resp.data.Data) {
        this.token = resp.data.Data;
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
    },
  },
  persist: {
    enabled: true, // 默认全部数据进行缓存， 如果不进行其它配置，默认使用缓存为会话缓存sessionStorage，并且使用该store的id作为key
    strategies: [{
      key: 'my_user', // 自定义缓存中的key键名
      storage: localStorage, // 自定义缓存类型，默认sessionStorage，
      paths: ['user', 'token'], // 自定义指定持久化的字段，默认为全部
    }],
  },
};

export const useUserStore = defineStore(options);
