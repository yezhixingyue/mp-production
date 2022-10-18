import { RouteRecordRaw } from 'vue-router';
import LoginView from '@/views/LoginView/index.vue';
import HomeView from '@/views/HomeView.vue';
import { RouteTreeType } from '@/router/modules/routerTypes';
import materialWarehouseRouteRoot from './materialWarehouse';
import productionResources from './productionResources';
import pasteupSettingRouteRoot from './pasteupSetting';
import otherSettingRouteRoot from './other';

export const moduleRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '首页',
      requiresAuth: true,
    },
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      requiresAuth: false,
    },
    component: LoginView,
  },
  productionResources.routes,
  pasteupSettingRouteRoot.routes,
  materialWarehouseRouteRoot.routes,
  otherSettingRouteRoot.routes,
  { // 无权限页
    path: '/notauth',
    name: 'notauth',
    meta: {
      title: '没有访问权限',
      hideMenu: true,
      requiresAuth: true,
    },
    component: () => import('@/views/NoAuthPage.vue'),
  },
];
const routeTree:RouteTreeType[] = [
  materialWarehouseRouteRoot.routeTree,
  productionResources.routeTree,
  pasteupSettingRouteRoot.routeTree,
  otherSettingRouteRoot.routeTree,
];

export default {
  moduleRoutes,
  routeTree,
};
