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
      },
      component: () => import('@/views/productionManage/EquipmentStatus/EquipmentStatusListPage.vue'),
    },
    /* 手工下单
    -------------------------------------- */
    {
      path: '/ManualOrder',
      name: 'ManualOrder',
      meta: {
        title: '手工下单',
        requiresAuth: true,
        icon: 'icon-shebeizhuangtai iconfont scale-9',
        pageName: 'ManualOrderHandlerPage',
      },
      component: () => import('@/views/productionManage/ManualOrderHandlerPage/ManualOrderHandlerPage.vue'),
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
