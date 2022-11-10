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
    /* 部门管理
    -------------------------------------- */
    {
      path: '/DepartmentManage',
      name: 'DepartmentManage',
      meta: {
        title: '部门管理',
        requiresAuth: true,
        icon: 'icon-yuangongliebiao iconfont',
        pageName: 'DepartmentManagePage',
      },
      component: () => import('@/views/companyManage/DepartmentManage/DepartmentManagePage.vue'),
    },
    /* 岗位管理
    -------------------------------------- */
    {
      path: '/PostManageList',
      name: 'PostManageList',
      meta: {
        title: '岗位管理',
        requiresAuth: true,
        icon: 'icon-yuangongliebiao iconfont',
        pageName: 'PostManageListPage',
      },
      component: () => import('@/views/companyManage/JobPostManage/PostManageListPage.vue'),
    },
    {
      path: '/PostManageSetup/:PositionID',
      name: 'PostManageSetup',
      meta: {
        title: '岗位权限设置',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'PostManageSetupPage',
      },
      component: () => import('@/views/companyManage/JobPostManage/PostManageSetupPage.vue'),
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
    /* 部门管理
    -------------------------------------- */
    {
      name: 'DepartmentManage',
      children: [],
    },
    /* 岗位管理
    -------------------------------------- */
    {
      name: 'PostManageList',
      children: [
        { name: 'PostManageSetup', children: [] },
      ],
    },
  ],
};

export default { routes, routeTree };
