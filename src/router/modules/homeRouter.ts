/*
*
*
*
* 主要解决了非首页需要传参的二级页面（如某列表的详情 详情需要参数查询）
*     然后点击头部的首页后返回此二级页面报错的问题 （禅道2196）
*     其他 (editableTabsValue 字段值由 '' 改为 '1')
*/
import { RouteRecordRaw } from 'vue-router';
import CommonNullView from '@/components/Layout/CommonNullView.vue';
import HomeView from '../../views/HomeView.vue';

const routes: RouteRecordRaw = {
  path: '/homeView',
  name: 'homeView',
  component: CommonNullView,
  meta: {
    title: '',
    requiresAuth: true,
  },
  children: [
    {
      path: '/homePage',
      name: 'homePage',
      meta: {
        title: '首页',
      },
      component: HomeView,
    },
  ],
};

export default { routes };
