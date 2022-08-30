import { RouteLocationNormalizedLoaded } from 'vue-router';

export interface addBarType {
  title: string|undefined
  path: string,
  name: string,
  isNew: boolean,
  closable: boolean,
  pageName: string|undefined,
}
export interface IState {
  editableTabs: addBarType[]
  editableTabsValue:any;
  leftMenuDefaultActive:string,
  otherTabPageNames:RouteLocationNormalizedLoaded[],
  oldRoute:RouteLocationNormalizedLoaded|undefined,
  isCollapse: boolean
}
export type IGetters = {
  curTabPagesNameList:()=>string[]
};

export interface IActions {
  setEditableTabsValue: (a:string)=> void
  addTabItem: (item:addBarType) => void;
  setLeftMenuDefaultActive:(name:string)=> void
  removeTabItem:(itemName:string)=> void
  changeCurTabPath:(newPath:string)=> void
  setOtherTabPageNames:(tabItem:RouteLocationNormalizedLoaded)=> void
  filterOtherTabPageNames:(routeNames:string[])=> void
}
