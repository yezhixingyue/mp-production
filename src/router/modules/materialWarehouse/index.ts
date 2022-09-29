import { RouteRecordRaw } from 'vue-router';
// import indexView from '@/views/materialWarehouse/materialClassify/indexView.vue';
// import LoginView from '@/views/LoginView/index.vue';
import CommonNullView from '@/components/Layout/CommonNullView.vue';
import { RouteTreeType } from '@/router/modules/routerTypes';

const routes: RouteRecordRaw = {
  path: '/materialWarehouse',
  name: 'materialWarehouse',
  component: CommonNullView,
  meta: {
    title: '物料仓储',
    requiresAuth: true,
    icon: 'iconfont icon-wuliaocangchu',
  },
  children: [
    {
      path: '/materialInventoryManage',
      name: 'materialInventoryManage',
      meta: {
        title: '库存管理',
        requiresAuth: true,
        icon: 'iconfont icon-kucunguanli',
        pageName: 'materialInventoryManagePage',
      },
      component: () => import('@/views/materialWarehouse/materialInventoryManage/materialInventoryManagePage.vue'),
    },
    {
      path: '/stockWarn',
      name: 'stockWarn',
      meta: {
        title: '预警记录',
        requiresAuth: true,
        hideMenu: true,
        icon: 'iconfont icon-chanpinguanli',
        pageName: 'stockWarnPage',
      },
      component: () => import('@/views/materialWarehouse/materialInventoryManage/stockWarnPage.vue'),
    },
    {
      path: '/outDelivery',
      name: 'outDelivery',
      meta: {
        title: '出库',
        requiresAuth: true,
        fullAcreen: true,
        hideMenu: true,
        icon: 'iconfont icon-chanpinguanli',
        pageName: 'outDeliveryPage',
      },
      component: () => import('@/views/materialWarehouse/materialInventoryManage/outDelivery.vue'),
    },
    {
      path: '/inDelivery',
      name: 'inDelivery',
      meta: {
        title: '入库',
        requiresAuth: true,
        fullAcreen: true,
        hideMenu: true,
        icon: 'iconfont icon-chanpinguanli',
        pageName: 'inDeliveryPage',
      },
      component: () => import('@/views/materialWarehouse/materialInventoryManage/inDelivery.vue'),
    },
    {
      path: '/makeAnInventory',
      name: 'makeAnInventory',
      meta: {
        title: '盘库',
        requiresAuth: true,
        fullAcreen: true,
        hideMenu: true,
        icon: 'iconfont icon-chanpinguanli',
        pageName: 'makeAnInventoryPage',
      },
      component: () => import('@/views/materialWarehouse/materialInventoryManage/makeAnInventoryPage.vue'),
    },
    {
      path: '/inventory',
      name: 'inventory',
      meta: {
        title: '库存盘点',
        requiresAuth: true,
        hideMenu: true,
        icon: 'iconfont icon-chanpinguanli',
        pageName: 'inventoryPage',
      },
      component: () => import('@/views/materialWarehouse/materialInventoryManage/inventoryPage.vue'),
    },
    {
      path: '/inventoryLog',
      name: 'inventoryLog',
      meta: {
        title: '盘点记录',
        requiresAuth: true,
        hideMenu: true,
        icon: 'iconfont icon-chanpinguanli',
        pageName: 'InventoryLogPage',
      },
      component: () => import('@/views/materialWarehouse/materialInventoryManage/InventoryLogPage.vue'),
    },

    {
      path: '/materialClassifyRecord',
      name: 'materialClassifyRecord',
      meta: {
        title: '出入库记录',
        requiresAuth: true,
        icon: 'iconfont icon-churukujilu',
        pageName: 'materialClassifyRecordPage',
        prevPage: 'materialClassifyManage',
      },
      component: () => import('@/views/materialWarehouse/materialClassifyRecordPage.vue'),
    },
    // 物料管理
    {
      path: '/materialManage',
      name: 'materialManage',
      meta: {
        title: '物料管理',
        requiresAuth: true,
        icon: 'iconfont icon-xinwuliaocaigoubaojiashenqingliucheng',
        pageName: 'materialManagePage',
        prevPage: 'materialClassifyManage',
      },
      component: () => import('@/views/materialWarehouse/materialManage/materialManagePage.vue'),
    },
    {
      path: '/materialManageSetuep',
      name: 'materialManageSetuep',
      meta: {
        title: '批量生成物料',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'materialManageSetuepPage',
      },
      component: () => import('@/views/materialWarehouse/materialManage/materialManageSetuepPage.vue'),
    },

    // 物料类型管理路由
    {
      path: '/materialClassifyManage',
      name: 'materialClassifyManage',
      meta: {
        title: '物料类型管理',
        requiresAuth: true,
        icon: 'iconfont icon-hesuankemuleixing',
        pageName: 'materialClassifyManagePage',
      },
      component: () => import('@/views/materialWarehouse/materialClassifyManage/materialClassifyManagePage.vue'),
    },
    {
      path: '/materialClassifyManageList',
      name: 'materialClassifyManageList',
      meta: {
        title: '管理物料分类',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'materialClassifyManageListPage',
      },
      component: () => import('@/views/materialWarehouse/materialClassifyManage/materialClassifyManageListPage.vue'),
    },
    {
      path: '/setAttributes',
      name: 'setAttributes',
      meta: {
        title: '设置纸张属性',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'setAttributesPage',
      },
      component: () => import('@/views/materialWarehouse/materialClassifyManage/setAttributesPage.vue'),
    },
    {
      path: '/setDimensions',
      name: 'setDimensions',
      meta: {
        title: '尺寸规格',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'setDimensionsPage',
      },
      component: () => import('@/views/materialWarehouse/materialClassifyManage/setDimensionsPage.vue'),
    },
    {
      path: '/setTheStorageUnit',
      name: 'setTheStorageUnit',
      meta: {
        title: '设置出入库单位',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'setTheStorageUnitPage',
      },
      component: () => import('@/views/materialWarehouse/materialClassifyManage/setTheStorageUnitPage.vue'),
    },
    // 供应商
    {
      path: '/materialSupplierManage',
      name: 'materialSupplierManage',
      meta: {
        title: '供应商管理',
        requiresAuth: true,
        icon: 'iconfont icon-gongyingshangguanli-',
        pageName: 'materialSupplierManagePage',
        prevPage: 'materialClassifyManage',
      },
      component: () => import('@/views/materialWarehouse/materialSupplierManage/materialSupplierManagePage.vue'),
    },
    {
      path: '/materialWarehouseManage',
      name: 'materialWarehouseManage',
      meta: {
        title: '仓库管理',
        requiresAuth: true,
        icon: 'iconfont icon-cangku_kucunxiangqing',
        pageName: 'materialWarehouseManagePage',
        prevPage: 'materialClassifyManage',
      },
      component: () => import('@/views/materialWarehouse/materialWarehouseManage/materialWarehouseManagePage.vue'),
    },
    {
      path: '/setPositionNumber',
      name: 'setPositionNumber',
      meta: {
        title: '设置货位编号',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'setPositionNumberPage',
      },
      component: () => import('@/views/materialWarehouse/materialWarehouseManage/setPositionNumberPage.vue'),
    },
    {
      path: '/goodsAllocation',
      name: 'goodsAllocation',
      meta: {
        title: '设置货位编号',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'goodsAllocationPage',
      },
      component: () => import('@/views/materialWarehouse/materialWarehouseManage/goodsAllocationPage.vue'),
    },
  ],
};
const routeTree:RouteTreeType = {
  name: 'materialWarehouse',
  isModuleRoot: true,
  children: [
    {
      name: 'materialInventoryManage',
      children: [
        { name: 'stockWarn', children: [] },
        {
          name: 'inventory',
          children: [
            { name: 'inventoryLog', children: [] },
          ],
        },
      ],
    },
    {
      name: 'materialClassifyRecord',
      children: [],
    },
    {
      name: 'materialManage',
      children: [
        { name: 'materialManageSetuep', children: [] },
      ],
    },
    {
      name: 'materialClassifyManage',
      children: [
        { name: 'materialClassifyManageList', children: [] },
        { name: 'setTheStorageUnit', children: [] },
        { name: 'setAttributes', children: [] },
        { name: 'setDimensions', children: [] },
      ],
    },
    {
      name: 'materialSupplierManage',
      children: [],
    },
    {
      name: 'materialWarehouseManage',
      children: [
        { name: 'setPositionNumber', children: [] },
        { name: 'goodsAllocation', children: [] },
      ],
    },
  ],
};

export default { routes, routeTree };
