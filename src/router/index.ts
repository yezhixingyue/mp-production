import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store/modules/user/index';
import LoginView from '../views/LoginView/index.vue';
import HomeView from '../views/HomeView.vue';
import moduleRoutes from './modules/index';

console.log(import.meta, moduleRoutes);

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.matched.some(record => record.meta.requiresAuth) && !userStore.token) {
    next({ path: '/login' });
  } else if (to.path === '/login' && userStore.token) {
    next({ path: '/' });
  } else {
    // console.log(to.path); // 此处判断是否需要权限，如果需要权限时需获取用户详情数据
    next();
  }
});

router.afterEach(to => {
  document.title = to.meta.title;
});

export default router;
