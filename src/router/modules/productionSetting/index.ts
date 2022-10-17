import { RouteRecordRaw } from 'vue-router';
import CommonNullView from '@/components/Layout/CommonNullView.vue';
import { RouteTreeType } from '@/router/modules/routerTypes';

const routes: RouteRecordRaw = {
  path: '/productionSetting',
  name: 'productionSetting',
  component: CommonNullView,
  meta: {
    title: '生产设置',
    requiresAuth: true,
    icon: 'iconfont icon-shebeifenlei',
  },
  children: [
    /* 生产线模块
    -------------------------------------- */
    {
      path: '/productionLine',
      name: 'productionLine',
      meta: {
        title: '生产线',
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'productionLinePage',
      },
      component: () => import('@/views/productionSetting/productionLine/productionLinePage.vue'),
    },
    /* 组合生产线模块
    -------------------------------------- */
    {
      path: '/assemblyLine',
      name: 'assemblyLine',
      meta: {
        title: '组合生产线',
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'assemblyLinePage',
      },
      component: () => import('@/views/productionSetting/assemblyLine/assemblyLinePage.vue'),
    },
    /* 工序模块
    -------------------------------------- */
    {
      path: '/processList',
      name: 'processList',
      meta: {
        title: '工序',
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'processListPage',
      },
      component: () => import('@/views/productionSetting/process/processListPage.vue'),
    },
    {
      path: '/processSetup',
      name: 'processSetup',
      meta: {
        title: '编辑工序',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'processSetupPage',
      },
      component: () => import('@/views/productionSetting/process/processSetupPage.vue'),
    },
    /* 发货班次模块
    -------------------------------------- */
    {
      path: '/deliveryTimeList',
      name: 'deliveryTimeList',
      meta: {
        title: '发货班次',
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'deliveryTimeListPage',
      },
      component: () => import('@/views/productionSetting/deliveryTimeManage/deliveryTimeListPage.vue'),
    },
    {
      path: '/deliveryTimeListSteup',
      name: 'deliveryTimeListSteup',
      meta: {
        title: '发货班次',
        requiresAuth: true,
        hideMenu: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'deliveryTimeListSteupPage',
      },
      component: () => import('@/views/productionSetting/deliveryTimeManage/deliveryTimeListSteupPage.vue'),
    },
  ],
};
const routeTree:RouteTreeType = {
  name: 'productionSetting',
  isModuleRoot: true,
  children: [
    /* 发货班次
    -------------------------------------- */
    {
      name: 'deliveryTimeList',
      children: [
        {
          name: 'deliveryTimeListSteup',
          children: [],
        },
      ],
    },
    /* 工序
    -------------------------------------- */
    {
      name: 'processList',
      children: [
        {
          name: 'processSetup',
          children: [],
        },
      ],
    },
  ],
};

export default { routes, routeTree };
