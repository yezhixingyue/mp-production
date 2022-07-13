import { RouteRecordRaw } from 'vue-router';
import materialWarehouseRouteRoot from './materialWarehouse';

const getRouteTree = (moduleRouteRoot: RouteRecordRaw) => {
  // const lv2List = moduleRouteRoot.children?.filter(it => it.meta?.icon);
  // console.log(moduleRouteRoot, lv2List);
};

console.log(getRouteTree(materialWarehouseRouteRoot));

export default {

};
