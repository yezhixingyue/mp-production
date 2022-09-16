import { RouteRecordRaw } from 'vue-router';
import CommonNullView from '@/components/Layout/CommonNullView.vue';
import { RouteTreeType } from '@/router/modules/routerTypes';

const routes: RouteRecordRaw = {
  path: '/productionResources',
  name: 'productionResources',
  component: CommonNullView,
  meta: {
    title: '生产资源',
    requiresAuth: true,
    icon: 'iconfont icon-shebeifenlei',
  },
  children: [
    /* 辅助信息模块
    -------------------------------------- */
    {
      path: '/assistInfo',
      name: 'assistInfo',
      meta: {
        title: '辅助信息',
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'assistInfoManagePage',
      },
      component: () => import('@/views/productionResources/assistInfo/assistInfoManagePage.vue'),
    },
    /* 物料资源包模块
    -------------------------------------- */
    {
      path: '/resourceBundleManage',
      name: 'resourceBundleManage',
      meta: {
        title: '物料资源包',
        requiresAuth: true,
        icon: 'iconfont icon-wuliaoziyuanbao',
        pageName: 'resourceBundleManagePage',
      },
      component: () => import('@/views/productionResources/resourceBundle/resourceBundleManagePage.vue'),
    },
    {
      path: '/resourceBundleSetup',
      name: 'resourceBundleSetup',
      meta: {
        title: '设置物料资源包',
        requiresAuth: true,
        pageName: 'resourceBundleSetupPage',
      },
      component: () => import('@/views/productionResources/resourceBundle/resourceBundleSetupPage.vue'),
    },
    /* 加工设备模块
    -------------------------------------- */
    {
      path: '/procesisngMachinery',
      name: 'procesisngMachinery',
      meta: {
        title: '加工设备',
        requiresAuth: true,
        icon: 'iconfont icon-gongsishebei',
        pageName: 'procesisngMachineryManagePage',
      },
      component: () => import('@/views/productionResources/procesisngMachinery/procesisngMachineryManage.vue'),
    },
    /* 设备组
    -------------------------------------- */
    {
      path: '/equipmentGroup',
      name: 'equipmentGroup',
      meta: {
        title: '设备组',
        requiresAuth: true,
        icon: 'iconfont icon-shebeizuhe',
        pageName: 'equipmentGroupManagePage',
      },
      component: () => import('@/views/productionResources/equipmentGroup/equipmentGroupManagePage.vue'),
    },
    {
      path: '/equipmentGroupMaterialLimitList',
      name: 'equipmentGroupMaterialLimitList',
      meta: {
        title: '物料限制列表 - 设备组',
        requiresAuth: true,
        pageName: 'equipmentGroupMaterialLimitListPage',
      },
      component: () => import('@/views/productionResources/equipmentGroup/equipmentGroupMaterialLimitListPage.vue'),
    },
    {
      path: '/equipmentGroupMaterialLimitSetup',
      name: 'equipmentGroupMaterialLimitSetup',
      meta: {
        title: '设置物料限制 - 设备组',
        requiresAuth: true,
        pageName: 'equipmentGroupMaterialLimitSetupPage',
      },
      component: () => import('@/views/productionResources/equipmentGroup/equipmentGroupMaterialLimitSetupPage.vue'),
    },
    /* 外协工厂
    -------------------------------------- */
    {
      path: '/subcontractor',
      name: 'subcontractor',
      meta: {
        title: '外协工厂',
        requiresAuth: true,
        icon: 'iconfont icon-qiyegongchangjianzhu',
        pageName: 'subcontractorManagePage',
      },
      component: () => import('@/views/productionResources/subcontractor/subcontractorManagePage.vue'),
    },
    /* 设备分类
    -------------------------------------- */
    {
      path: '/equipmentClassification',
      name: 'equipmentClassification',
      meta: {
        title: '设备分类',
        requiresAuth: true,
        icon: 'iconfont icon-shebeifenlei',
        pageName: 'equipmentClassificationManagePage',
      },
      component: () => import('@/views/productionResources/equipmentClassification/equipmentClassificationManagePage.vue'),
    },
  ],
};
const routeTree:RouteTreeType = {
  name: 'productionResources',
  isModuleRoot: true,
  children: [
    /* 辅助信息
    -------------------------------------- */
    {
      name: 'assistInfo',
      children: [],
    },
    /* 物料资源包
    -------------------------------------- */
    {
      name: 'resourceBundleManage',
      children: [
        { name: 'resourceBundleSetup', children: [] },
      ],
    },
    /* 加工设备
    -------------------------------------- */
    {
      name: 'procesisngMachinery',
      children: [],
    },
    /* 设备组
    -------------------------------------- */
    {
      name: 'equipmentGroup',
      children: [
        {
          name: 'equipmentGroupMaterialLimitList',
          children: [
            { name: 'equipmentGroupMaterialLimitSetup', children: [] },
          ],
        },
      ],
    },
    /* 外协工厂
    -------------------------------------- */
    {
      name: 'subcontractor',
      children: [],
    },
    /* 设备分类
    -------------------------------------- */
    {
      name: 'equipmentClassification',
      children: [],
    },
  ],
};

export default { routes, routeTree };
