import { RouteRecordRaw } from 'vue-router';
import CommonNullView from '@/components/Layout/CommonNullView.vue';
import { RouteTreeType } from '@/router/modules/routerTypes';

const routes: RouteRecordRaw = {
  path: '/productionManage',
  name: 'productionManage',
  component: CommonNullView,
  meta: {
    title: '生产管理',
    requiresAuth: true,
    icon: 'iconfont icon-shengchanguanli scale-9',
  },
  children: [
    /* 设备状态看板
    -------------------------------------- */
    {
      path: '/EquipmentStatus',
      name: 'EquipmentStatus',
      meta: {
        title: '设备状态',
        requiresAuth: true,
        icon: 'icon-shebeizhuangtai iconfont scale-9',
        pageName: 'EquipmentStatusListPage',
        PermissionInfo: ['Developing', 'None'],
      },
      component: () => import('@/views/productionManagePages/EquipmentStatus/EquipmentStatusListPage.vue'),
    },
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
        // PermissionInfo: ['Developing', 'None'],
      },
      component: () => import('@/views/productionManagePages/ManualOrderHandlerPage/ManualOrderHandlerPage.vue'),
    },
    /* 订单
    -------------------------------------- */
    {
      path: '/ManageOrderList',
      name: 'ManageOrderList',
      meta: {
        title: '订单',
        requiresAuth: true,
        icon: 'icon-dingdan iconfont scale-9',
        pageName: 'ManageOrderListPage',
        PermissionInfo: ['Developing', 'None'],
      },
      component: () => import('@/views/productionManagePages/ManageOrderListPage/ManageOrderListPage.vue'),
    },
  ],
};
const routeTree:RouteTreeType = {
  name: 'productionManage',
  isModuleRoot: true,
  children: [
    /* 转换器
    -------------------------------------- */
    {
      name: 'EquipmentStatus',
      children: [],
    },
  ],
};

export default { routes, routeTree };
