import { nextTick, ref } from 'vue';
import { Router } from 'vue-router';
import { getLastRouteInfoByName } from '@/router/modules/getLastRouteInfoByName';

export const refreshing = ref(false);
export const atRefreshing = ref(false);

/**
 * 刷新当前标签页
 *
 * @param {Router} router
 * @returns
 */
export const setRefreshing = async (router: Router) => {
  // 1. 如果不在根目录 则先回到根目录
  const rootRouteName = getLastRouteInfoByName(router.currentRoute.value.name, 'root');
  if (rootRouteName && rootRouteName !== router.currentRoute.value.name) {
    atRefreshing.value = true;
    router.replace({ name: rootRouteName });
    refreshing.value = true;
    setTimeout(() => {
      setRefreshing(router);
    }, 10);
    return;
  }

  // 2. 重新加载页面组件
  atRefreshing.value = true;
  refreshing.value = true;

  await nextTick();

  refreshing.value = false;

  setTimeout(() => {
    atRefreshing.value = false;
  }, 200);
};
