import { RouteRecordRaw } from 'vue-router';
import CommonNullView from '@/components/Layout/CommonNullView.vue';
import { RouteTreeType } from '@/router/modules/routerTypes';

const routes: RouteRecordRaw = {
  path: '/pasteupSetting',
  name: 'pasteupSetting',
  component: CommonNullView,
  meta: {
    title: '拼版设置',
    requiresAuth: true,
    icon: 'iconfont icon-wuliaocangchu',
  },
  children: [
    // 拼版模板
    {
      path: '/pasteupTemplate',
      name: 'pasteupTemplate',
      meta: {
        title: '拼版模板',
        requiresAuth: true,
        icon: 'iconfont icon-chanpinguanli',
        pageName: 'pasteupTemplatePage',
      },
      component: () => import('@/views/pasteupSetting/pasteupTemplate/pasteupTemplatePage.vue'),
    },
    {
      path: '/pasteupTemplateSteup',
      name: 'pasteupTemplateSteup',
      meta: {
        title: '拼版模板',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'pasteupTemplateSteupPage',
      },
      component: () => import('@/views/pasteupSetting/pasteupTemplate/pasteupTemplateSteupPage.vue'),
    },
    // 印色管理
    {
      path: '/printingColorManagement',
      name: 'printingColorManagement',
      meta: {
        title: '印色管理',
        requiresAuth: true,
        icon: 'iconfont icon-chanpinguanli',
        pageName: 'printingColorManagementPage',
      },
      component: () => import('@/views/pasteupSetting/printingColorManagementPage.vue'),
    },

    {
      path: '/stockWarn',
      name: 'stockWarn',
      meta: {
        title: '预警记录',
        requiresAuth: true,
        hideMenu: true,
        icon: 'iconfont icon-chanpinguanli',
        pageName: 'stockWarnPage',
      },
      component: () => import('@/views/materialWarehouse/materialInventoryManage/stockWarnPage.vue'),
    },
  ],
};
const routeTree:RouteTreeType = {
  name: 'pasteupSetting',
  isModuleRoot: true,
  children: [
    {
      name: 'pasteupTemplate',
      children: [
        { name: 'pasteupTemplateSteup', children: [] },
      ],
    },
  ],
};

export default { routes, routeTree };
