import { defineStore, DefineStoreOptions } from 'pinia';
import { RouteLocationNormalized } from 'vue-router';
import router, { getGoBackFun } from '@/router';

interface IState {
  lastPagePaths:RouteLocationNormalized[],
}
interface IActions {
  setLastPagePaths:(path:RouteLocationNormalized)=>void,
  setLastPagePathsFilterAfterGoback:(name:string)=>void,
  replace:(routerUrl:string)=>void,
  goBack:()=>void,
}
type IGetters = Record<string, never>;

const options: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'routerStore',
  state: () => ({
    lastPagePaths: [],
  }),
  getters: {
  },
  actions: {
    setLastPagePaths(path:RouteLocationNormalized) { // 设置上一个页面的path路径
      this.lastPagePaths = this.lastPagePaths.filter((
        it:RouteLocationNormalized,
      ) => it.name !== path.name);
      this.lastPagePaths.push(path);
    },
    setLastPagePathsFilterAfterGoback(name:string) { // 回转页面信息后删除掉回转前的路由信息,
      this.lastPagePaths = this.lastPagePaths.filter((
        it:RouteLocationNormalized,
      ) => it.name !== name);
    },

    replace(routerUrl) { // 回转页面信息后删除掉回转前的路由信息,
      router.router.replace(routerUrl);
    },
    goBack() { // 返回
      getGoBackFun();
    },
  },
};
export const useRouterStore = defineStore(options);
