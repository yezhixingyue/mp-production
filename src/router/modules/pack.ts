import { RouteRecordRaw } from 'vue-router';
import packView from '@/components/pack.vue';
import { RouteTreeType } from '@/router/modules/routerTypes';

const routes: RouteRecordRaw = {
  path: '/pack',
  name: 'pack',
  component: packView,
  meta: {
    title: '打包机台',
    requiresAuth: true,
    icon: 'iconfont icon-shengchanxian',
  },
};
const routeTree:RouteTreeType = {
  name: 'pack',
  isModuleRoot: true,
  children: [],
};

export default { routes, routeTree };
