import { RouteRecordRaw } from 'vue-router';
import CommonNullView from '@/components/Layout/CommonNullView.vue';
import { RouteTreeType } from '@/router/modules/routerTypes';

const routes: RouteRecordRaw = {
  path: '/productionManage',
  name: 'productionManage',
  component: CommonNullView,
  meta: {
    title: '生产管理',
    requiresAuth: true,
    icon: 'iconfont icon-shengchanguanli scale-9',
  },
  children: [
    /* 设备状态看板
    -------------------------------------- */
    {
      path: '/EquipmentStatus',
      name: 'EquipmentStatus',
      meta: {
        title: '设备状态',
        requiresAuth: true,
        icon: 'icon-shebeizhuangtai iconfont scale-9',
        pageName: 'EquipmentStatusListPage',
        PermissionInfo: ['PermissionEquipmentStatus', 'HavePomission'],
      },
      component: () => import('@/views/productionManagePages/EquipmentStatus/List/EquipmentStatusListPage.vue'),
    },
    {
      path: '/ProcessDecompositionOrderList',
      name: 'ProcessDecompositionOrderList',
      meta: {
        title: '订单审核',
        requiresAuth: true,
        icon: 'icon-dingdanshenhe iconfont scale-11',
        pageName: 'ProcessDecompositionOrderListView',
        PermissionInfo: ['PermissionCraftSolve', 'HavePomission'],
      },
      component: () => import('@/views/productionManagePages/ProcessDecompositionOrderList/ProcessDecompositionOrderListView.vue'),
    },
    { // ProcessDecompositionOrderDetail
      path: '/ProcessDecompositionOrderDetail',
      name: 'ProcessDecompositionOrderDetail',
      meta: {
        title: '订单审核详情',
        requiresAuth: true,
        // icon: 'icon-dingdanshenhe iconfont scale-11',
        pageName: 'ProcessDecompositionOrderDetailView',
        PermissionInfo: ['PermissionCraftSolve', 'HavePomission'],
      },
      // eslint-disable-next-line max-len
      component: () => import('@/views/productionManagePages/ProcessDecompositionOrderList/childrenPages/PDODetailView/ProcessDecompositionOrderDetailView.vue'),
    },
    {
      path: '/ProcessDecompositionOrderSetup',
      name: 'ProcessDecompositionOrderSetup',
      meta: {
        title: '订单审核',
        requiresAuth: true,
        // icon: 'icon-dingdanshenhe iconfont scale-11',
        pageName: 'ProcessDecompositionOrderSetupView',
        PermissionInfo: ['PermissionCraftSolve', 'HavePomission'],
      },
      component: () => import('@/views/productionManagePages/ProcessDecompositionOrderList/childrenPages/PDOSetupView/PDOSetupView.vue'),
    },
    {
      path: '/ProcessDecompositionOrderSubmit',
      name: 'ProcessDecompositionOrderSubmit',
      meta: {
        title: '订单审核提交',
        requiresAuth: true,
        // icon: 'icon-dingdanshenhe iconfont scale-11',
        pageName: 'ProcessDecompositionOrderSubmitView',
        PermissionInfo: ['PermissionCraftSolve', 'HavePomission'],
      },
      component: () => import('@/views/productionManagePages/ProcessDecompositionOrderList/childrenPages/PDOSubmitView/PDOSubmitView.vue'),
    },
    {
      path: '/EquipmentStatusDetail',
      name: 'EquipmentStatusDetail',
      meta: {
        title: '设备状态',
        requiresAuth: true,
        pageName: 'EquipmentStatusDetailPage',
        PermissionInfo: ['PermissionEquipmentStatus', 'Obj', 'QueryTask'],
      },
      component: () => import('@/views/productionManagePages/EquipmentStatus/Detail/EquipmentStatusDetailPage.vue'),
    },
    /* 手动下单
    -------------------------------------- */
    {
      path: '/ManualOrder',
      name: 'ManualOrder',
      meta: {
        title: '手动下单',
        requiresAuth: true,
        icon: 'icon-header-03 iconfont scale-12',
        pageName: 'ManualOrderHandlerPage',
        hideMenu: true,
        PermissionInfo: ['PermissionManualOrder', 'HavePomission'],
        fullAcreen: true,
      },
      component: () => import('@/views/productionManagePages/ManualOrderHandlerPage/ManualOrderHandlerPage.vue'),
    },
    /* 大版
    -------------------------------------- */
    {
      path: '/ManagePlateList',
      name: 'ManagePlateList',
      meta: {
        title: '大版',
        requiresAuth: true,
        icon: 'icon-daban iconfont',
        pageName: 'ManagePlateListPage',
        PermissionInfo: ['PermissionManagePlate', 'HavePomission'],
      },
      component: () => import('@/views/productionManagePages/ManagePlateListPage/ManagePlateListPage.vue'),
    },
    /* 块
    -------------------------------------- */
    {
      path: '/ManageChunkList',
      name: 'ManageChunkList',
      meta: {
        title: '块',
        requiresAuth: true,
        icon: 'icon-kuai iconfont',
        pageName: 'ManageChunkListPage',
        PermissionInfo: ['PermissionManageChunk', 'HavePomission'],
      },
      component: () => import('@/views/productionManagePages/ManageChunkListPage/ManageChunkListPage.vue'),
    },
    /* 订单
    -------------------------------------- */
    {
      path: '/ManageOrderList',
      name: 'ManageOrderList',
      meta: {
        title: '订单',
        requiresAuth: true,
        icon: 'icon-dingdan iconfont',
        pageName: 'ManageOrderListPage',
        PermissionInfo: ['PermissionManageOrder', 'HavePomission'],
      },
      component: () => import('@/views/productionManagePages/ManageOrderListPage/ManageOrderListPage.vue'),
    },
    /* 后工版
    -------------------------------------- */
    {
      path: '/ManageLaterCraftPlateList',
      name: 'ManageLaterCraftPlateList',
      meta: {
        title: '后工版',
        requiresAuth: true,
        icon: 'icon-hougongbanben iconfont',
        pageName: 'ManageLaterCraftPlateListPage',
        PermissionInfo: ['PermissionManagePlate', 'HavePomission'],
      },
      component: () => import('@/views/productionManagePages/ManagePlateListPage/ManageLaterCraftPlateList.vue'),
    },
    /* 外来物料
    -------------------------------------- */
    {
      path: '/ManageOutsideMaterialList',
      name: 'ManageOutsideMaterialList',
      meta: {
        title: '外来物料',
        requiresAuth: true,
        icon: 'icon-wuliaodaohuo iconfont',
        pageName: 'ManageOutsideMaterialListPage',
        PermissionInfo: ['PermissionExternalMaterial', 'HavePomission'],
      },
      component: () => import('@/views/productionManagePages/ManageOutsideMaterialListPage/ManageOutsideMaterialListPage.vue'),
    },
    /* 设备管理
    -------------------------------------- */
    {
      path: '/ManageEquipmentList',
      name: 'ManageEquipmentList',
      meta: {
        title: '设备管理',
        requiresAuth: true,
        icon: 'icon-shebeiguanli iconfont',
        pageName: 'ManageEquipmentListPage',
        PermissionInfo: ['PermissionManageEquipment', 'HavePomission'],
      },
      component: () => import('@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/ManageEquipmentListPage.vue'),
    },
    {
      path: '/ManageEquipmentRunTime',
      name: 'ManageEquipmentRunTime',
      meta: {
        title: '设备运行时间',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'ManageEquipmentRunTimePage',
        PermissionInfo: ['PermissionManageEquipment', 'Obj', 'Setup'],
      },
      component: () => import('@/views/productionManagePages/ManageEquipment/ManageEquipmentRunTimePage/ManageEquipmentRunTimePage.vue'),
    },
    /* 已完成任务列表
    -------------------------------------- */
    {
      path: '/ManageTaskList',
      name: 'ManageTaskList',
      meta: {
        title: '已完成任务',
        requiresAuth: true,
        icon: 'icon-shengchanrenwu iconfont',
        pageName: 'ManageTaskListPage',
        PermissionInfo: ['PermissionManageTask', 'HavePomission'],
      },
      component: () => import('@/views/productionManagePages/ManageTaskListPage/ManageTaskListPage.vue'),
    },
    /* 数码工单打印
    -------------------------------------- */
    {
      path: '/ManageDigitalList',
      name: 'ManageDigitalList',
      meta: {
        title: '数码工单打印',
        requiresAuth: true,
        icon: 'icon-shumagongdandayin1 iconfont scale-11',
        pageName: 'ManageDigitalListPage',
        PermissionInfo: ['PermissionManageDigitalPlate', 'HavePomission'],
      },
      component: () => import('@/views/productionManagePages/ManageDigitalListPage/ManageDigitalListPage.vue'),
    },
    /* 数码完工任务
    -------------------------------------- */
    {
      path: '/DigitalCompletionTaskList',
      name: 'DigitalCompletionTaskList',
      meta: {
        title: '数码完工任务',
        requiresAuth: true,
        icon: 'icon-shumawangongrenwu iconfont scale-11',
        pageName: 'DigitalCompletionTaskListView',
        PermissionInfo: ['PermissionManageDigitalTask', 'HavePomission'],
      },
      component: () => import('@/views/productionManagePages/DigitalCompletionTaskList/DigitalCompletionTaskListView.vue'),
    },
    /** 补打标签 */
    {
      path: '/rePrint',
      name: 'rePrint',
      meta: {
        title: '补打标签',
        requiresAuth: true,
        icon: 'icon-daiwaixie iconfont',
        pageName: 'TagRePrintPage',
        // PermissionInfo: ['PermissionExternalStored', 'HavePomission'],
        PermissionInfo: ['PermissionManageChunk', 'Obj', 'RePrint'],
        hideMenu: true,
        fullAcreen: true,
      },
      component: () => import('@/views/productionManagePages/TagRePrintPage/TagRePrintPage.vue'),
    },
  ],
};
const routeTree:RouteTreeType = {
  name: 'productionManage',
  isModuleRoot: true,
  children: [
    /* 设备状态看板
    -------------------------------------- */
    {
      name: 'EquipmentStatus',
      children: [
        { name: 'EquipmentStatusDetail', children: [] },
      ],
    },
    /* 订单审核
    -------------------------------------- */
    {
      name: 'ProcessDecompositionOrderList',
      children: [
        {
          name: 'ProcessDecompositionOrderSetup',
          children: [{ name: 'ProcessDecompositionOrderSubmit', children: [] }],
        },
        { name: 'ProcessDecompositionOrderDetail', children: [] },
      ],
    },
    /* 手动下单
    -------------------------------------- */
    {
      name: 'ManualOrder',
      children: [],
    },
    /* 大版
    -------------------------------------- */
    {
      name: 'ManagePlateList',
      children: [],
    },
    /* 块
    -------------------------------------- */
    {
      name: 'ManageChunkList',
      children: [],
    },
    /* 订单
    -------------------------------------- */
    {
      name: 'ManageOrderList',
      children: [],
    },
    /* 外来物料
    -------------------------------------- */
    {
      name: 'ManageOutsideMaterialList',
      children: [],
    },
    /* 设备管理
    -------------------------------------- */
    {
      name: 'ManageEquipmentList',
      children: [
        {
          name: 'ManageEquipmentRunTime',
          children: [],
        },
      ],
    },
    /* 生产任务
    -------------------------------------- */
    {
      name: 'ManageTaskList',
      children: [],
    },
    /* 数码工单打印
    -------------------------------------- */
    {
      name: 'ManageDigitalList',
      children: [],
    },
    /* 数码完工任务
    -------------------------------------- */
    {
      name: 'DigitalCompletionTaskList',
      children: [],
    },
  ],
};

export default { routes, routeTree };
