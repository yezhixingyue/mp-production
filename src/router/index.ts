import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
// import { useUserStore } from '@/store/modules/user/index';
import LoginView from '../views/LoginView/index.vue';
import HomeView from '../views/HomeView.vue';
import { moduleRoutes } from './modules/index';
import { goBackLastPage, handleRouterEach } from './modules/handleRouterEach';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '首页',
      requiresAuth: true,
    },
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      requiresAuth: false,
    },
    component: LoginView,
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   meta: {
  //     title: '关于',
  //     requiresAuth: true,
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  // },
  ...moduleRoutes,
  { // 无权限页
    path: '/notauth',
    name: 'notauth',
    meta: {
      title: '没有访问权限',
      hideMenu: true,
      requiresAuth: true,
    },
    component: () => import('@/views/NoAuthPage.vue'),
  },
];

export const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) { // 记录页面滚动位置
    // console.log(to, from);
    return savedPosition || { top: 0 };
  },
  routes,
});

handleRouterEach(router);

// router.beforeEach((to, from, next) => {
//   console.log('router.beforeEach');

//   const userStore = useUserStore();
//   if (to.matched.some(record => record.meta.requiresAuth) && !userStore.token) {
//     next({ path: '/login' });
//   } else if (to.path === '/login' && userStore.token) {
//     next({ path: '/' });
//   } else {
//     // console.log(to.path); // 此处判断是否需要权限，如果需要权限时需获取用户详情数据
//     next();
//   }
// });

// router.afterEach(to => {
//   document.title = String(to.meta.title);
// });
export const getGoBackFun = () => {
  goBackLastPage(router);
};
export default { router, getGoBackFun };
