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
    icon: 'iconfont icon-guanli',
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
        icon: 'icon-shebeifenlei iconfont',
        pageName: 'AdaptersManagePage',
      },
      component: () => import('@/views/otherSetup/AdaptersManage/AdaptersManagePage.vue'),
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
  ],
};

export default { routes, routeTree };
