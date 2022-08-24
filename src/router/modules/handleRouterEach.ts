import { useCommonStore } from '@/store/modules/common';
// import NProgress from 'nprogress';
// import 'nprogress/nprogress.css';
// import messageBox from '../assets/js/utils/message';
import TokenClass from '@/assets/js/utils/tokenManage';
import { useUserStore } from '@/store/modules/user';
// import { RouterType } from '@/router/modules/routerTypes';
import { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { getLastRouteInfoByName } from './getLastRouteInfoByName';

// if (window.location.protocol.includes('https')) {
//   window.location = window.location.href.replace('https', 'http');
// }
/*  页面进度条
------------------------------------------ */
// NProgress.configure({
//   trickleSpeed: 50,
//   showSpinner: false,
// });

/*  处理跳转报错
------------------------------------------ */
// const routerPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location) {
//   return routerPush.call(this, location).catch(error => error);
// };

/**
 * @description: 主要作用为在页面跳转时向vuex中加入跳转前的历史记录
 * @param {*}
 * @return {*}
 */
const NextHandler = (
  from:RouteLocationNormalized,
  to:RouteLocationNormalized,
  next:NavigationGuardNext,
) => {
  const CommonStore = useCommonStore();
  // store.commit('common/setLastPagePaths', from);
  CommonStore.setLastPagePaths(from);
  next();
};

/**
 * @description: 记录是否为首次初始化运行
 */
// const isInit = true;

/**
  * 处理权限验证信息，在forEach中使用
  *
  * @param {*} to
  * @param {*} next
  * @param {*} Permission 权限信息列表
  */
// function handlePermission(
//   to:RouteLocationNormalized,
//   next:NavigationGuardNext,
//   Permission:string,
//   from:RouteLocationNormalized,
// ) {
//   let key = Permission;
//   if (!to.meta.PermissionInfo) { // 如果没有设定则予以通过
//     key = '';
//   } else {
//     try {
//       to.meta.PermissionInfo.forEach((item:any) => { // 2.5 获取到当前页面所需要的权限信息，看是否满足权限要求
//         key = key[item];
//       });
//     } catch (error) {
//       if (process.env.NODE_ENV === 'development'
//          && to.meta.PermissionInfo
//          && to.meta.PermissionInfo[0]
//          && to.meta.PermissionInfo[0] === 'Developing') {
//         key = '';
//       } else {
//         // messageBox.failSingleError(undefined, '[ 权限信息读取失败 ]');
//       }
//     }
//   }
//   if (key) {
//     if (isInit) { // 初始根页面跳转
//       if (to.matched.length >= 2) {
//         if (to.name) {
//           const t = getLastRouteInfoByName(to.name, 'root');
//           if (t) next({ name: t });
//         }
//       }
//       isInit = false;
//     }
//     // if (from.name !== to.name) NProgress.start();
//     NextHandler(from, to, next); // 2.6 如果满足权限要求则允许跳转， 否则跳转提示页面
//   } else next({ path: '/notauth' });
// }

/**
   * @description:  用于替代系统回退的方法
   * @param {*}
   * @return {*}
   */
export const goBackLastPage = (router:Router) => {
  const CommonStore = useCommonStore();
  if (!router || !router.currentRoute) return;
  const curRouteName = router.currentRoute.value.name;
  if (!curRouteName) return;
  // 1 首先找到其上一级的路由name名称
  const lastRouteName = getLastRouteInfoByName(curRouteName);

  if (!lastRouteName) return;
  // 2 然后根据该name名称在lastPaths中从后往前找到其上级name所对应的路径名称
  const lastPaths = CommonStore.lastPagePaths;
  if (!Array.isArray(lastPaths)) return;
  const t = lastPaths.find(it => it.name === lastRouteName);
  if (!t) return;
  // 3 完成跳转 并在缓存状态中清除掉刚已跳转离开的页面缓存信息
  router.replace(t.fullPath);
  setTimeout(() => {
    // store.commit('common/setLastPagePathsFilterAfterGoback', curRouteName);
    CommonStore.setLastPagePathsFilterAfterGoback(curRouteName as string);
  }, 0);
};

export const handleRouterEach = (router:Router) => {
  router.beforeEach(
    (
      to:RouteLocationNormalized,
      from:RouteLocationNormalized,
      next:NavigationGuardNext,
    ) => { // 使用全局路由导航守卫进行权限控制
      const userStore = useUserStore();
      // NextHandler(from, to, next);
      // // 暂时不做限制
      // next();

      const { token } = userStore;

      // 2.2 判断要去往的页面中有无token要求，如果无则跳转否则则进入判
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (to.name === 'login') { // 2.3 登录页面不考虑，直接跳转
          if (token) { // 如果有token 不允许跳转
            next({ name: 'home' });
          } else {
          // TokenClass.removeToken();
            NextHandler(from, to, next);
          }
        } else if (token) { // 2.4 如果有token信息，获取到当前用户权限信息
        // const permission = store.state.common.Permission;
        // if (!permission || permission.Token !== token) {
        //   TokenClass.getPermission(token).then(res => {
        //     if (res && Object.prototype.toString.call(res)
        //       === '[object Object]' && res.Token && res.Token === token) {
        //       store.commit('common/setPermission', res);
        //       handlePermission(to, next, res.PermissionList, from);
        //     }
        //   });
        // } else if (permission.Token === token) {
        //   handlePermission(to, next, permission.PermissionList, from);
        // } else {
        //   TokenClass.removeToken();
        //   next({
        //     path: '/login',
        //   });
        // }
        // 临时调用
          next();
        } else { // 如果没有token，跳转登录或提示页面
          TokenClass.removeToken();
          next({
            path: '/login', // 此处应当跳转登录页面
          // query: { redirect: to.fullPath },
          });
        }

        // 临时调用
        NextHandler(from, to, next);
        next();
      } else if (to.name === 'login' && token) {
        next({ name: 'home' });
      } else {
        TokenClass.removeToken();
        NextHandler(from, to, next);
      }
    },
  );

  router.afterEach((to:RouteLocationNormalized) => {
    if (to.meta.title) { // 1. 根据路由元信息中title信息设置页面标题
      document.title = `${to.meta.title} - 名片之家后台管理系统`;
    }
    // NProgress.done();
  });

  /**
   * @description: 阻止并替换浏览器默认回退方法
   * @param {*}
   * @return {*}
   */

  window.addEventListener('popstate', (e) => {
    // eslint-disable-next-line no-restricted-globals
    // history.pushState(null, '', '/');
    let url = '/';
    console.log(router.currentRoute.value.fullPath, 'router.currentRoute.value.fullPath----', window.location.pathname, 'e:', e.state.forward);
    if (router && router.currentRoute.value && router.currentRoute.value.fullPath) {
      url = `${router.currentRoute.value.fullPath}`;
    }
    if (e.state.forward) {
      url = e.state.forward;
    }
    console.log(url, router, router.currentRoute.value.fullPath, 'urlurlurlurlurlurlurlurlurlurlurlurlurlurlurlurlurlurlurlurlurl');
    // eslint-disable-next-line no-restricted-globals
    history.pushState(null, '', url);
    goBackLastPage(router);
  });
};

export default handleRouterEach;
