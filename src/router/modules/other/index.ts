import { RouteRecordRaw } from 'vue-router';
import CommonNullView from '@/components/Layout/CommonNullView.vue';
import { RouteTreeType } from '@/router/modules/routerTypes';

const routes: RouteRecordRaw = {
  path: '/otherSetup',
  name: 'otherSetup',
  component: CommonNullView,
  meta: {
    title: '其它设置',
    requiresAuth: true,
    icon: 'iconfont icon-guanli scale-13',
  },
  children: [
    /* 转换器
    -------------------------------------- */
    {
      path: '/adapters',
      name: 'adapters',
      meta: {
        title: '转换服务器',
        requiresAuth: true,
        icon: 'icon-zhuanhuanqi scale-13 iconfont',
        pageName: 'AdaptersManagePage',
      },
      component: () => import('@/views/otherSetup/AdaptersManage/AdaptersManagePage.vue'),
    },
    /* 设置管理密码
    -------------------------------------- */
    {
      path: '/ManageAdminPassword',
      name: 'ManageAdminPassword',
      meta: {
        title: '设置管理密码',
        requiresAuth: true,
        icon: 'icon-suoding scale-13 iconfont',
        pageName: 'ManageAdminPasswordPage',
      },
      component: () => import('@/views/otherSetup/ManageAdminPasswordPage/ManageAdminPasswordPage.vue'),
    },
  ],
};
const routeTree:RouteTreeType = {
  name: 'otherSetup',
  isModuleRoot: true,
  children: [
    /* 转换器
    -------------------------------------- */
    {
      name: 'adapter',
      children: [],
    },
    /* 设置管理密码
    -------------------------------------- */
    {
      name: 'ManageAdminPassword',
      children: [],
    },
  ],
};

export default { routes, routeTree };
