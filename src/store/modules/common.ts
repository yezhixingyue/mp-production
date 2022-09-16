import api from '@/api';
import { defineStore, DefineStoreOptions } from 'pinia';
import { RouteLocationNormalized, useRouter } from 'vue-router';
import { getGoBackFun } from '@/router';

const Router = useRouter();
interface StaffSelectListType {
  StaffID: string,
  StaffName: string
}
interface IState {
  lastPagePaths:RouteLocationNormalized[],
  StaffSelectList:StaffSelectListType[],
  size:string,
}
interface IActions {
  setLastPagePaths:(path:RouteLocationNormalized)=>void,
  setLastPagePathsFilterAfterGoback:(name:string)=>void,
  getStaffSelect:()=>void,
  onresize:(size:string)=>void,
  replace:(routerUrl:string)=>void,
  goBack:()=>void,
}
type IGetters = Record<string, never>;

const options: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'common',
  state: () => ({
    lastPagePaths: [],
    StaffSelectList: [],
    size: '',
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
    getStaffSelect() { // 回转页面信息后删除掉回转前的路由信息,
      api.getStaffSelect().then(res => {
        if (res.data.Status === 1000) {
          this.StaffSelectList = res.data.Data as StaffSelectListType[];
        }
      });
    },
    onresize(size) { // 回转页面信息后删除掉回转前的路由信息,
      this.size = size;
    },
    replace(routerUrl) { // 回转页面信息后删除掉回转前的路由信息,
      Router.replace(routerUrl);
    },
    goBack() { // 返回
      getGoBackFun();
    },
  },
};
export const useCommonStore = defineStore(options);
