import { RouteRecordRaw } from 'vue-router';
import CommonNullView from '@/components/Layout/CommonNullView.vue';
import { RouteTreeType } from '@/router/modules/routerTypes';

const routes: RouteRecordRaw = {
  path: '/OutsourceManage',
  name: 'OutsourceManage',
  component: CommonNullView,
  meta: {
    title: '外协管理',
    requiresAuth: true,
    icon: 'iconfont icon-waixieguanli scale-9',
  },
  children: [
    /* 待外协
    -------------------------------------- */
    {
      path: '/WaitOutsourceManage',
      name: 'WaitOutsourceManage',
      meta: {
        title: '待外协',
        requiresAuth: true,
        icon: 'icon-daiwaixie iconfont',
        pageName: 'WaitOutsourceManagePage',
        PermissionInfo: ['PermissionManageExternalTask', 'Obj', 'WaitQuery'],
      },
      component: () => import('@/views/OutsourceManage/WaitOutsourceManage/WaitOutsourceManagePage.vue'),
    },
    /* 外协加工入库
    -------------------------------------- */
    {
      path: '/ExternalReceiveManage/:type',
      name: 'ExternalReceiveManage',
      meta: {
        title: '外协入库',
        requiresAuth: true,
        icon: 'icon-daiwaixie iconfont',
        pageName: 'ExternalReceiveManagePage',
        PermissionInfo: ['PermissionExternalStored', 'HavePomission'],
        hideMenu: true,
        fullAcreen: true,
      },
      component: () => import('@/views/OutsourceManage/ExternalReceiveManage/ExternalReceiveManagePage.vue'),
    },
    /* 已入库未交接
    -------------------------------------- */
    {
      path: '/WarehousedNoReceive',
      name: 'WarehousedNoReceive',
      meta: {
        title: '已入库未交接',
        requiresAuth: true,
        icon: 'icon-yirukuweijiaojie iconfont',
        pageName: 'WarehousedNoReceiveListPage',
        PermissionInfo: ['PermissionManageExternalTask', 'Obj', 'InstoredQuery'],
      },
      component: () => import('@/views/OutsourceManage/WarehousedNoReceive/WarehousedNoReceiveListPage.vue'),
    },
    /* 全部外协
    -------------------------------------- */
    {
      path: '/AllOutsourceList',
      name: 'AllOutsourceList',
      meta: {
        title: '全部外协',
        requiresAuth: true,
        icon: 'icon-quanbuwaixie iconfont',
        pageName: 'AllOutsourceListPage',
        PermissionInfo: ['PermissionManageExternalTask', 'Obj', 'Query'],
      },
      component: () => import('@/views/OutsourceManage/AllOutsourceList/AllOutsourceListPage.vue'),
    },
  ],
};

const routeTree:RouteTreeType = {
  name: 'OutsourceManage',
  isModuleRoot: true,
  children: [
    /* 待外协
    -------------------------------------- */
    {
      name: 'WaitOutsourceManage',
      children: [],
    },
    /* 已入库未交接
    -------------------------------------- */
    {
      name: 'WarehousedNoReceive',
      children: [],
    },
    /* 全部外协
    -------------------------------------- */
    {
      name: 'AllOutsourceList',
      children: [],
    },
  ],
};

export default { routes, routeTree };
