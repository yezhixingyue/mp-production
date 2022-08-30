import api from '@/api';
import { defineStore, DefineStoreOptions } from 'pinia';
import { RouteLocationNormalized } from 'vue-router';

interface DistrictType {
    ID: number,
    Name: string,
    ParentID: number,
    IsVirtual: boolean,
    Level: number
}
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
  },
};
export const useCommonStore = defineStore(options);
