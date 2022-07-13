import { RouteRecordRaw } from 'vue-router';

const moduleRouteRoot: RouteRecordRaw = {
  path: 'materialWarehouse',
  name: 'materialWarehouseRoot',
  redirect: '/materialClassifyManage',
  meta: {
    title: '物料仓储',
    requiresAuth: true,
    icon: 'el-icon-menu',
  },
  children: [
    // 设置物料分类管理路由
    {
      path: '/materialClassifyManage',
      name: 'materialClassifyManage',
      meta: {
        title: '物料分类管理',
        requiresAuth: true,
        icon: 'iconfont icon-chanpinguanli',
        pageName: 'materialClassifyManagePage',
      },
      component: () => import(/* webpackChunkName: "materialClassify" */ '@/views/materialWarehouse/materialClassify/indexView.vue'),
    },
    {
      path: '/materialClassifySetProp',
      name: 'materialClassifySetProp',
      meta: {
        title: '设置属性 - 物料分类',
        requiresAuth: true,
        pageName: 'materialClassifySetPropPage',
        prevPage: 'materialClassifyManage',
      },
      component: () => import(/* webpackChunkName: "materialClassify" */ '@/views/materialWarehouse/materialClassify/materialClassifySetPropPage.vue'),
    },
    {
      path: '/materialClassifySetProp',
      name: 'materialClassifySetProp',
      meta: {
        title: '尺寸规格 - 物料分类',
        requiresAuth: true,
        pageName: 'materialClassifySetSizePage',
        prevPage: 'materialClassifyManage',
      },
      component: () => import(/* webpackChunkName: "materialClassify" */ '@/views/materialWarehouse/materialClassify/materialClassifySetSizePage.vue'),
    },
    {
      path: '/materialClassifySetUnit',
      name: 'materialClassifySetUnit',
      meta: {
        title: '出入库单位 - 物料分类',
        requiresAuth: true,
        pageName: 'materialClassifySetUnitPage',
        prevPage: 'materialClassifyManage',
      },
      component: () => import(/* webpackChunkName: "materialClassify" */ '@/views/materialWarehouse/materialClassify/materialClassifySetUnitPage.vue'),
    },
  ],
};

console.log(moduleRouteRoot);

export default moduleRouteRoot;
