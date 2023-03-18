/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { RouteRecordRaw } from 'vue-router';

/**
 * 获取是否拥有登录手动下单或外协入库的权限
 *
 *
 */
export const getHasLoginPermission = () => {
  const userStore = useUserStore();
  if (!userStore.token || !userStore.user || typeof userStore.user !== 'object') {
    ElMessage({ showClose: true, message: '未获取到登录信息', type: 'error' });
    return false;
  }

  // 此处待后期权限增加后判断是否拥有权限信息 -- 暂时模拟下
  if (Math.random() < 0.1) {
    ElMessage({ showClose: true, message: '无登录权限', type: 'error' });
    userStore.token = '';
    return false;
  }

  return true;
};

/**
 * 在home页面获取OrderApp登录后跳转的页面并进行跳转
 *
 * @returns
 */
export const setOrderAppJumpPath = () => {
  const list: RouteRecordRaw[] = [];
  // 1. 无权限情况
  if (!getHasLoginPermission()) {
    list.push({
      path: '/login',
      redirect: '',
    });
    return list;
  }

  // 2. 有权限 直接返回权限对应页面  优先级：手动下单 -> 外协入库  如果传递了curPath则以其为最高优先级
  const orderAppRoutes = require('./orderAppRoutes');
  const routes = orderAppRoutes.default.routes as RouteRecordRaw;

  routes.children?.forEach(route => {
    // if (routes.meta?.PermissionInfo) {
    list.push(route);
    // }
  });

  return list;
};
