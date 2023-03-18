import { RouteRecordRaw } from 'vue-router';
import { RouteTreeType } from '@/router/modules/routerTypes';
import OrderAppRoutePage from './OrderAppRoutePage.vue';

const routes: RouteRecordRaw = {
  path: '/orderAppRoutes',
  name: 'orderAppRoutes',
  component: OrderAppRoutePage,
  meta: {
    title: '生产下单与外协入库',
    requiresAuth: true,
    icon: 'iconfont icon-waixieguanli scale-9',
  },
  children: [
    /* 手动下单
    -------------------------------------- */
    {
      path: '/ManualOrder',
      name: 'ManualOrder',
      meta: {
        title: '手动下单',
        requiresAuth: true,
        icon: 'icon-header-03 iconfont scale-12',
        pageName: 'ManualOrderHandlerPage',
        fullAcreen: true,
        // PermissionInfo: ['Developing', 'None'],
      },
      component: () => import('@/views/productionManagePages/ManualOrderHandlerPage/ManualOrderHandlerPage.vue'),
    },
    /* 外协加工入库
    -------------------------------------- */
    {
      path: '/ExternalReceiveManage',
      name: 'ExternalReceiveManage',
      meta: {
        title: '外协入库',
        requiresAuth: true,
        icon: 'icon-daiwaixie iconfont',
        pageName: 'ExternalReceiveManagePage',
        // PermissionInfo: ['Developing', 'None'],
        fullAcreen: true,
      },
      component: () => import('@/views/OutsourceManage/ExternalReceiveManage/ExternalReceiveManagePage.vue'),
    },
  ],
};

const routeTree:RouteTreeType = {
  name: 'orderAppRoutes',
  isModuleRoot: true,
  children: [
    /* 手动下单
    -------------------------------------- */
    {
      name: 'ManualOrder',
      children: [],
    },
    /* 外协加工入库
    -------------------------------------- */
    {
      name: 'ExternalReceiveManage',
      children: [],
    },
  ],
};

export default { routes, routeTree };
