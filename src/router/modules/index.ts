import { RouteRecordRaw } from 'vue-router';
import { RouteTreeType } from '@/router/modules/routerTypes';
import materialWarehouseRouteRoot from './materialWarehouse';
import productionResources from './productionResources';
import pasteupSettingRouteRoot from './pasteupSetting';
import otherSettingRouteRoot from './other';
import companyManageRouteRoot from './companyManage';
import productionManageRouteRoot from './productionManage';
import productionRouteRoot from './productionSetting';
import ExceptionManageRouteRoot from './ExceptionManage';
import OutsourceManageRouteRoot from './OutsourceManage';
import orderAppRouteRoot from './OrderAppRouteManage/orderAppRoutes';

const isOrderApp = process.env.VUE_APP_TARGET === 'My Order App';

export const moduleRoutes: RouteRecordRaw[] = isOrderApp ? [orderAppRouteRoot.routes] : [
  {
    path: '/client',
    name: 'client',
    meta: {
      title: '生产报工',
      requiresAuth: false,
    },
    component: () => import(/* webpackChunkName: "client" */ '@/views/ProductionClient/ProductionClientView.vue'),
  },
  ExceptionManageRouteRoot.routes,
  productionManageRouteRoot.routes,
  OutsourceManageRouteRoot.routes,
  productionRouteRoot.routes,
  productionResources.routes,
  pasteupSettingRouteRoot.routes,
  materialWarehouseRouteRoot.routes,
  companyManageRouteRoot.routes,
  otherSettingRouteRoot.routes,
];
const routeTree:RouteTreeType[] = isOrderApp ? [orderAppRouteRoot.routeTree] : [
  materialWarehouseRouteRoot.routeTree,
  productionResources.routeTree,
  pasteupSettingRouteRoot.routeTree,
  otherSettingRouteRoot.routeTree,
  companyManageRouteRoot.routeTree,
  productionManageRouteRoot.routeTree,
  productionRouteRoot.routeTree,
  ExceptionManageRouteRoot.routeTree,
  OutsourceManageRouteRoot.routeTree,
];

export default {
  moduleRoutes,
  routeTree,
};
