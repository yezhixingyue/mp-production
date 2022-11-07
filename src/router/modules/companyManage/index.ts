import { RouteRecordRaw } from 'vue-router';
import CommonNullView from '@/components/Layout/CommonNullView.vue';
import { RouteTreeType } from '@/router/modules/routerTypes';

const routes: RouteRecordRaw = {
  path: '/companyManage',
  name: 'companyManage',
  component: CommonNullView,
  meta: {
    title: '企业管理',
    requiresAuth: true,
    icon: 'iconfont icon-qiyeguanli',
  },
  children: [
    /* 员工管理
    -------------------------------------- */
    {
      path: '/StaffList',
      name: 'StaffList',
      meta: {
        title: '员工管理',
        requiresAuth: true,
        icon: 'icon-yuangongliebiao iconfont',
        pageName: 'StaffManageListPage',
      },
      component: () => import('@/views/companyManage/StaffManage/StaffManageListPage.vue'),
    },
    {
      path: '/StaffSetup',
      name: 'StaffSetup',
      meta: {
        title: '员工设置',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'StaffManageSetupPage',
      },
      component: () => import('@/views/companyManage/StaffManage/StaffManageSetupPage.vue'),
    },
  ],
};
const routeTree:RouteTreeType = {
  name: 'companyManage',
  isModuleRoot: true,
  children: [
    /* 员工管理
    -------------------------------------- */
    {
      name: 'StaffList',
      children: [
        { name: 'StaffSetup', children: [] },
      ],
    },
  ],
};

export default { routes, routeTree };
