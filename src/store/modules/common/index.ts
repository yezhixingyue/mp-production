import { defineStore, DefineStoreOptions } from 'pinia';
import api from '@/api';
import { IDistrictItem, StaffSelectListType, ExpressListType } from '@/assets/Types/common';
import { IDistrictTreeListItemType } from './types';

interface IState {
  DistrictList: IDistrictItem[]
  StaffSelectList:StaffSelectListType[],
  ExpressList:ExpressListType[],
}

type IGetters = {
  DistrictTreeList(state: IState): IDistrictTreeListItemType[]
};

interface IActions {
  getDistrictList: () => void,
  getStaffSelect:()=>void,
  getExpressList:()=>void,
}

const options: DefineStoreOptions<string, IState, IGetters, IActions> = { // 存放公共数据的模块
  id: 'common',
  state: () => ({
    DistrictList: [],
    StaffSelectList: [],
    ExpressList: [],
  }),
  getters: {
    DistrictTreeList(state: IState) { // 行政地区树形列表数据
      const _list = state.DistrictList;
      if (_list.length === 0) return [];
      const level1List: IDistrictTreeListItemType[] = _list.filter(item => item.Level === 1).map(i => ({ ...i, children: [] }));
      level1List.forEach(level1 => {
        const _level2list: IDistrictTreeListItemType[] = _list.filter(item => item.Level === 2 && item.ParentID === level1.ID)
          .map(item => ({ ...item, children: [] }));
        const _level1 = level1;
        _level1.children = _level2list;
        _level1.children.forEach(level2 => {
          const _level3list: IDistrictTreeListItemType[] = _list.filter(item => item.Level === 3 && item.ParentID === level2.ID);
          const _level2 = level2;
          _level2.children = _level3list;
        });
      });
      return level1List;
    },
  },
  actions: {
    async getDistrictList() {
      if (this.DistrictList.length > 0) return;
      const resp = await api.getDistrictList().catch(() => null);
      if (resp?.data.isSuccess) {
        this.DistrictList = resp.data.Data;
      }
    },
    async getStaffSelect() { // 回转页面信息后删除掉回转前的路由信息,
      const resp = await api.getStaffSelect().catch(() => null);
      if (resp?.data.Status === 1000) {
        this.StaffSelectList = resp.data.Data as StaffSelectListType[];
      }
    },
    async getExpressList() { // 配送方式列表
      api.getExpressList().then(res => {
        if (res?.data.Status === 1000) {
          this.ExpressList = res.data.Data as ExpressListType[];
        }
      });
    },
  },
  persist: {
    key: 'my_prod_common', // 自定义缓存中的key键名
    storage: sessionStorage, // 自定义缓存类型，默认sessionStorage，
    paths: ['DistrictList'], // 自定义指定持久化的字段，默认为全部
  },
};

export const useCommonStore = defineStore(options);
