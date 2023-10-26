import { RouteRecordRaw } from 'vue-router';
import CommonNullView from '@/components/Layout/CommonNullView.vue';
import { RouteTreeType } from '@/router/modules/routerTypes';

const routes: RouteRecordRaw = {
  path: '/ExceptionManage',
  name: 'ExceptionManage',
  component: CommonNullView,
  meta: {
    title: '异常处理',
    requiresAuth: true,
    icon: 'iconfont icon-yichangguanli scale-9',
  },
  children: [
    /* 生产异常
    -------------------------------------- */
    {
      path: '/ProductionExceptionList',
      name: 'ProductionExceptionList',
      meta: {
        title: '生产异常',
        requiresAuth: true,
        icon: 'icon-shengchanyichang iconfont',
        pageName: 'ProductionExceptionListPage',
        PermissionInfo: ['PermissionTaskException', 'HavePomission'],
      },
      component: () => import('@/views/ExceptionManage/ProductionException/ProductionExceptionListPage.vue'),
    },
    {
      path: '/ProductionExceptionSetup',
      name: 'ProductionExceptionSetup',
      meta: {
        title: '生产异常处理', // 详情或处理
        requiresAuth: true,
        hideMenu: true,
        pageName: 'productionExceptionSetupPage',
        PermissionInfo: ['PermissionTaskException', 'Obj', 'Deal'],
      },
      component: () => import('@/views/ExceptionManage/ProductionException/productionExceptionSetupPage.vue'),
    },
    {
      path: '/ProductionExceptionDetail',
      name: 'ProductionExceptionDetail',
      meta: {
        title: '生产异常处理详情', // 详情或处理
        requiresAuth: true,
        hideMenu: true,
        pageName: 'productionExceptionDetailPage',
        PermissionInfo: ['PermissionTaskException', 'Obj', 'Query'],
      },
      component: () => import('@/views/ExceptionManage/ProductionException/productionExceptionDetailPage.vue'),
    },
    /* 外协异常
    -------------------------------------- */
    {
      path: '/OutsourceExceptionList',
      name: 'OutsourceExceptionList',
      meta: {
        title: '外协异常',
        requiresAuth: true,
        icon: 'icon-waixieyichang iconfont',
        pageName: 'OutsourceExceptionListPage',
        PermissionInfo: ['PermissionExternalException', 'HavePomission'],
      },
      component: () => import('@/views/ExceptionManage/OutsourceException/OutsourceExceptionListPage.vue'),
    },
    {
      path: '/OutsourceExceptionSetup',
      name: 'OutsourceExceptionSetup',
      meta: {
        title: '外协异常处理',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'OutsourceExceptionSetupPage',
        PermissionInfo: ['PermissionExternalException', 'Obj', 'Deal'],
      },
      component: () => import('@/views/ExceptionManage/OutsourceException/OutsourceExceptionSetupPage.vue'),
    },
    {
      path: '/OutsourceExceptionDetail',
      name: 'OutsourceExceptionDetail',
      meta: {
        title: '外协异常处理详情',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'OutsourceExceptionDetailPage',
        PermissionInfo: ['PermissionExternalException', 'Obj', 'Query'],
      },
      component: () => import('@/views/ExceptionManage/OutsourceException/OutsourceExceptionDetailPage.vue'),
    },
    /* 排程异常
    -------------------------------------- */
    {
      path: '/ScheduleExceptionList',
      name: 'ScheduleExceptionList',
      meta: {
        title: '排程异常',
        requiresAuth: true,
        icon: 'icon-paichengyichang iconfont',
        pageName: 'ScheduleExceptionListPage',
        PermissionInfo: ['PermissionScheduleException', 'HavePomission'],
      },
      component: () => import('@/views/ExceptionManage/ScheduleException/ScheduleExceptionListPage.vue'),
    },
  ],
};
const routeTree:RouteTreeType = {
  name: 'ExceptionManage',
  isModuleRoot: true,
  children: [
    /* 生产异常
    -------------------------------------- */
    {
      name: 'ProductionExceptionList',
      children: [
        { name: 'ProductionExceptionSetup', children: [] },
        { name: 'ProductionExceptionDetail', children: [] },
      ],
    },
    /* 外协异常
    -------------------------------------- */
    {
      name: 'OutsourceExceptionList',
      children: [
        { name: 'OutsourceExceptionSetup', children: [] },
        { name: 'OutsourceExceptionDetail', children: [] },
      ],
    },
  ],
};

export default { routes, routeTree };
