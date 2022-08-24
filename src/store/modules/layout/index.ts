import { defineStore, DefineStoreOptions } from 'pinia';
import { RouteLocationNormalizedLoaded } from 'vue-router';

import {
  addBarType, IState, IGetters, IActions,
} from './addBarType';

const options: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'layout',
  state: () => ({
    editableTabs: [],
    editableTabsValue: '',
    leftMenuDefaultActive: '',
    otherTabPageNames: [],
    oldRoute: undefined,
    isCollapse: false,
  }),
  // 也可以定义为
  // state: () => ({ count: 0 })
  getters: {
    curTabPagesNameList() {
      const otherList = this.otherTabPageNames.map((it:RouteLocationNormalizedLoaded) => it.meta);
      const list = [...this.editableTabs, ...otherList];
      if (list.length === 0) return [];
      return list.filter(it => it.pageName).map(it => it.pageName as string);
    },
  },
  actions: {
    // 设置头部选中的按钮值
    setEditableTabsValue(itemName: string):void { // 设置顶部导航按钮值
      if (this.editableTabsValue === itemName) return;
      const t = this.editableTabs.find((it:addBarType) => it.name === itemName);
      if (t) t.isNew = false;
      this.editableTabsValue = itemName;
    },
    // 头部添加按钮
    addTabItem(item:addBarType) { // 添加顶部导航按钮
      this.editableTabs.push(item);
      this.editableTabsValue = item.name;
    },
    // 设置左侧导航栏选中的值
    setLeftMenuDefaultActive(name:string) { // 设置左侧导航活动按钮索引值
      this.leftMenuDefaultActive = name;
    },
    removeTabItem(itemName:string) { // 关闭当前
      const tabs = this.editableTabs;
      this.editableTabs = tabs.filter((tab:addBarType) => tab.name !== itemName);
    },
    //
    changeCurTabPath(newPath:string) { // 页面内路由跳转时 记录其路径记录 方便页面跳转不会返回最初页面
      const targetTab = this.editableTabs.find((
        it:addBarType,
      ) => it.name === this.editableTabsValue);
      if (targetTab && targetTab.path !== newPath) targetTab.path = newPath;
    },
    setOtherTabPageNames(tabItem:RouteLocationNormalizedLoaded) {
      const t = this.otherTabPageNames.find((it) => it.name === tabItem.name);
      if (!t) this.otherTabPageNames.push(tabItem);
    },
    filterOtherTabPageNames(routeNames:string[]) {
      this.otherTabPageNames = this.otherTabPageNames
        .filter((it) => !routeNames.includes(it.name as string));
    },
  },
};
export const useLayoutStore = defineStore(options);
