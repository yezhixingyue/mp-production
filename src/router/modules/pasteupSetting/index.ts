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
    icon: 'iconfont icon-wuliaoziyuanbao',
  },
  children: [
    // 拼版模板
    {
      path: '/pasteupTemplate',
      name: 'pasteupTemplate',
      meta: {
        title: '拼版模板',
        requiresAuth: true,
        icon: 'iconfont icon-pintu scale-8',
        pageName: 'pasteupTemplatePage',
        PermissionInfo: ['PermissionManageImposition', 'HavePomission'],
      },
      component: () => import('@/views/pasteupSetting/pasteupTemplate/pasteupTemplatePage.vue'),
    },
    // {
    //   path: '/impositionTemmplateClass',
    //   name: 'impositionTemmplateClass',
    //   meta: {
    //     title: '拼版模板',
    //     requiresAuth: true,
    //     hideMenu: true,
    //     pageName: 'impositionTemmplateClassListPage',
    //   },
    //   component: () => import('@/views/pasteupSetting/pasteupTemplate/impositionTemmplateClassListPage.vue'),
    // },
    {
      path: '/templateSetSize',
      name: 'templateSetSize',
      meta: {
        title: '设置模板尺寸',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'templateSetSizePage',
      },
      component: () => import('@/views/pasteupSetting/pasteupTemplate/templateSetSize.vue'),
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
    // 折手模板
    {
      path: '/foldWayTemplate',
      name: 'foldWayTemplate',
      meta: {
        title: '折手模板',
        requiresAuth: true,
        icon: 'iconfont icon-foldzhedie scale-8',
        pageName: 'foldWayTemplateListPage',
        PermissionInfo: ['PermissionManageFolding', 'HavePomission'],
      },
      component: () => import('@/views/pasteupSetting/foldWayTemplate/foldWayTemplateListPage.vue'),
    },
    {
      path: '/foldWayTemplateSteup',
      name: 'foldWayTemplateSteup',
      meta: {
        title: '折手模板',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'foldWayTemplateSteupPage',
      },
      component: () => import('@/views/pasteupSetting/foldWayTemplate/foldWayTemplateSteupPage.vue'),
    },
    {
      path: '/foldWayTemplateClass',
      name: 'foldWayTemplateClass',
      meta: {
        title: '分类管理',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'foldWayTemplateClassListPage',
      },
      component: () => import('@/views/pasteupSetting/foldWayTemplate/foldWayTemplateClassListPage.vue'),
    },
    // 印色管理
    {
      path: '/printingColorManagement',
      name: 'printingColorManagement',
      meta: {
        title: '印色管理',
        requiresAuth: true,
        icon: 'iconfont icon-yanse',
        pageName: 'printingColorManagementPage',
        PermissionInfo: ['PermissionManageColor', 'HavePomission'],
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
        // { name: 'impositionTemmplateClass', children: [] },
        {
          name: 'templateSetSize',
          children: [
            { name: 'pasteupTemplateSteup', children: [] },
          ],
        },

      ],
    },
    {
      name: 'foldWayTemplate',
      children: [
        { name: 'foldWayTemplateClass', children: [] },
        { name: 'foldWayTemplateSteup', children: [] },
      ],
    },
  ],
};

export default { routes, routeTree };
