import { RouteRecordRaw } from 'vue-router';
import CommonNullView from '@/components/Layout/CommonNullView.vue';
import { RouteTreeType } from '@/router/modules/routerTypes';

const routes: RouteRecordRaw = {
  path: '/productionSetting',
  name: 'productionSetting',
  component: CommonNullView,
  meta: {
    title: '生产设置',
    requiresAuth: true,
    icon: 'iconfont icon-shebeifenlei',
  },
  children: [
    /* 生产线模块
    -------------------------------------- */
    {
      path: '/productionLine',
      name: 'productionLine',
      meta: {
        title: '生产线',
        requiresAuth: true,
        icon: 'iconfont icon-shengchanxian',
        pageName: 'productionLinePage',
      },
      component: () => import('@/views/productionSetting/productionLine/productionLinePage.vue'),
    },
    {
      path: '/materialSource',
      name: 'materialSource',
      meta: {
        title: '物料来源',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'materialSourcePage',
      },
      component: () => import('@/views/productionSetting/productionLine/materialSourcePage.vue'),
    },
    {
      path: '/equipment',
      name: 'equipment',
      meta: {
        title: '生产设备',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'equipmentPage',
      },
      component: () => import('@/views/productionSetting/productionLine/equipmentPage.vue'),
    },
    {
      path: '/putOut',
      name: 'putOut',
      meta: {
        title: '伸放',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'putOutPage',
      },
      component: () => import('@/views/productionSetting/productionLine/LinePutOutPage/putOutPage.vue'),
    },
    {
      path: '/putOutSetup',
      name: 'putOutSetup',
      meta: {
        title: '设置伸放',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'putOutSetupPage',
      },
      component: () => import('@/views/productionSetting/productionLine/LinePutOutPage/putOutSetupPage.vue'),
    },
    {
      path: '/capacity',
      name: 'capacity',
      meta: {
        title: '设备产能',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'capacityPage',
      },
      component: () => import('@/views/productionSetting/productionLine/LineCapacityPage/capacityPage.vue'),
    },
    {
      path: '/capacitySetup',
      name: 'capacitySetup',
      meta: {
        title: '设置设备产能',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'capacitySetupPage',
      },
      component: () => import('@/views/productionSetting/productionLine/LineCapacityPage/capacitySetupPage.vue'),
    },
    /* 组合生产线模块
    -------------------------------------- */
    {
      path: '/combinationProductionLine',
      name: 'combinationProductionLine',
      meta: {
        title: '组合生产线',
        requiresAuth: true,
        icon: 'iconfont icon-zuheshengchanxian',
        pageName: 'combinationProductionLinePage',
      },
      component: () => import('@/views/productionSetting/combinationProductionLine/combinationProductionLinePage.vue'),
    },
    {
      path: '/combinationMaterialSource',
      name: 'combinationMaterialSource',
      meta: {
        title: '物料来源',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'combinationMaterialSourcePage',
      },
      component: () => import('@/views/productionSetting/combinationProductionLine/combinationMaterialSourcePage.vue'),
    },
    {
      path: '/combinationEquipment',
      name: 'combinationEquipment',
      meta: {
        title: '生产设备',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'combinationEquipmentPage',
      },
      component: () => import('@/views/productionSetting/combinationProductionLine/combinationEquipmentPage.vue'),
    },
    {
      path: '/combinationPutOut',
      name: 'combinationPutOut',
      meta: {
        title: '伸放',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'combinationPutOutPage',
      },
      component: () => import('@/views/productionSetting/combinationProductionLine/CombineLinePutOutPage/combinationPutOutPage.vue'),
    },
    {
      path: '/combinationPutOutSetup',
      name: 'combinationPutOutSetup',
      meta: {
        title: '设置伸放',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'combinationPutOutSetupPage',
      },
      component: () => import('@/views/productionSetting/combinationProductionLine/CombineLinePutOutPage/combinationPutOutSetupPage.vue'),
    },
    {
      path: '/combinationCapacity',
      name: 'combinationCapacity',
      meta: {
        title: '生产设备产能',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'combinationCapacityPage',
      },
      component: () => import('@/views/productionSetting/combinationProductionLine/CombineLineCapacityPage/combinationCapacityPage.vue'),
    },
    {
      path: '/combinationCapacitySetup',
      name: 'combinationCapacitySetup',
      meta: {
        title: '设置生产设备产能',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'combinationCapacitySetupPage',
      },
      component: () => import('@/views/productionSetting/combinationProductionLine/CombineLineCapacityPage/combinationCapacitySetupPage.vue'),
    },
    /* 制版组模块
    -------------------------------------- */
    {
      path: '/PlateMakingGroupList',
      name: 'PlateMakingGroupList',
      meta: {
        title: '制版组',
        requiresAuth: true,
        icon: 'iconfont icon-zuheshengchanxian',
        pageName: 'PlateMakingGroupListPage',
      },
      component: () => import('@/views/productionSetting/PlateMakingGroupView/PlateMakingGroupListPage/PlateMakingGroupListPage.vue'),
    },
    {
      path: '/PlateMakingGroupEquipmentList',
      name: 'PlateMakingGroupEquipmentList',
      meta: {
        title: '选择设备/工厂',
        requiresAuth: true,
        hideMenu: true,
        pageName: 'PlateMakingGroupEquipmentListPage',
      },
      component: () => import('@/views/productionSetting/PlateMakingGroupView/PlateMakingGroupEquipment/PlateMakingGroupEquipmentListPage.vue'),
    },
    {
      path: '/plateMakingGroupEquipmentPutOut',
      name: 'plateMakingGroupEquipmentPutOut',
      meta: {
        title: '伸放',
        hideMenu: true,
        requiresAuth: true,
        pageName: 'PlateMakingGroupEquipmentPutOutPage',
      },
      component: () => import('@/views/productionSetting/PlateMakingGroupView/PlateMakingGroupEquipment/PutOut/PlateMakingGroupEquipmentPutOutPage.vue'),
    },
    {
      path: '/plateMakingGroupEquipmentPutOutSetup',
      name: 'plateMakingGroupEquipmentPutOutSetup',
      meta: {
        title: '设置伸放',
        hideMenu: true,
        requiresAuth: true,
        pageName: 'PlateMakingGroupEquipmentPutOutSetupPage',
      },
      component: () => import('@/views/productionSetting/PlateMakingGroupView/PlateMakingGroupEquipment/PutOut/PlateMakingGroupEquipmentPutOutSetupPage.vue'),
    },
    {
      path: '/plateMakingGroupEquipmentCapacity',
      name: 'plateMakingGroupEquipmentCapacity',
      meta: {
        title: '产能',
        hideMenu: true,
        requiresAuth: true,
        pageName: 'PlateMakingGroupEquipmentCapacityPage',
      },
      component: () => import('@/views/productionSetting/PlateMakingGroupView/PlateMakingGroupEquipment/Capacity/PlateMakingGroupEquipmentCapacityPage.vue'),
    },
    {
      path: '/plateMakingGroupEquipmentCapacitySetup',
      name: 'plateMakingGroupEquipmentCapacitySetup',
      meta: {
        title: '设置产能',
        hideMenu: true,
        requiresAuth: true,
        pageName: 'PlateMakingGroupEquipmentCapacitySetupPage',
      },
      // eslint-disable-next-line max-len
      component: () => import('@/views/productionSetting/PlateMakingGroupView/PlateMakingGroupEquipment/Capacity/PlateMakingGroupEquipmentCapacitySetupPage.vue'),
    },
    {
      path: '/plateMakingGroupMakingGroupSource',
      name: 'plateMakingGroupMakingGroupSource',
      meta: {
        title: '物料来源设置',
        hideMenu: true,
        requiresAuth: true,
        pageName: 'PlateMakingGroupMakingGroupSourcePage',
      },
      component: () => import('@/views/productionSetting/PlateMakingGroupView/PlateMakingGroupMakingGroupSourcePage.vue'),
    },
    /* 工序模块
    -------------------------------------- */
    {
      path: '/processList',
      name: 'processList',
      meta: {
        title: '工序',
        requiresAuth: true,
        icon: 'iconfont icon-gongxu',
        pageName: 'processListPage',
      },
      component: () => import('@/views/productionSetting/process/processListPage.vue'),
    },
    {
      path: '/processSetup',
      name: 'processSetup',
      meta: {
        title: '编辑工序',
        hideMenu: true,
        requiresAuth: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'processSetupPage',
      },
      component: () => import('@/views/productionSetting/process/processSetupPage.vue'),
    },
    /* 发货班次模块
    -------------------------------------- */
    {
      path: '/deliveryTimeList',
      name: 'deliveryTimeList',
      meta: {
        title: '发货班次',
        requiresAuth: true,
        icon: 'iconfont icon-fahuobanci',
        pageName: 'deliveryTimeListPage',
      },
      component: () => import('@/views/productionSetting/deliveryTimeManage/deliveryTimeListPage.vue'),
    },
    {
      path: '/deliveryTimeListSteup',
      name: 'deliveryTimeListSteup',
      meta: {
        title: '发货班次',
        requiresAuth: true,
        hideMenu: true,
        icon: 'iconfont icon-xinxi',
        pageName: 'deliveryTimeListSteupPage',
      },
      component: () => import('@/views/productionSetting/deliveryTimeManage/deliveryTimeListSteupPage.vue'),
    },
  ],
};
const routeTree:RouteTreeType = {
  name: 'productionSetting',
  isModuleRoot: true,
  children: [
    /* 发货班次
    -------------------------------------- */
    {
      name: 'deliveryTimeList',
      children: [
        {
          name: 'deliveryTimeListSteup',
          children: [],
        },
      ],
    },
    /* 工序
    -------------------------------------- */
    {
      name: 'processList',
      children: [
        {
          name: 'processSetup',
          children: [],
        },
      ],
    },
    /* 制版组
    -------------------------------------- */
    {
      name: 'PlateMakingGroupList',
      children: [
        {
          name: 'PlateMakingGroupEquipmentList', // 选择设备/工厂页面
          children: [
            {
              name: 'plateMakingGroupEquipmentPutOut',
              children: [
                { name: 'plateMakingGroupEquipmentPutOutSetup', children: [] },
              ],
            },
            {
              name: 'plateMakingGroupEquipmentCapacity',
              children: [
                { name: 'plateMakingGroupEquipmentCapacitySetup', children: [] },
              ],
            },
          ],
        },
        { name: 'plateMakingGroupMakingGroupSource', children: [] },
      ],
    },
    /* 生产线
    -------------------------------------- */
    {
      name: 'productionLine',
      children: [
        {
          name: 'materialSource',
          children: [],
        },
        {
          name: 'equipment',
          children: [
            {
              name: 'putOut',
              children: [
                {
                  name: 'putOutSetup',
                  children: [],
                },
              ],
            },
            {
              name: 'capacity',
              children: [
                {
                  name: 'capacitySetup',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    /* 组合生产线
    -------------------------------------- */
    {
      name: 'combinationProductionLine',
      children: [
        {
          name: 'combinationMaterialSource',
          children: [],
        },
        {
          name: 'combinationEquipment',
          children: [
            {
              name: 'combinationPutOut',
              children: [
                {
                  name: 'combinationPutOutSetup',
                  children: [],
                },
              ],
            },
            {
              name: 'combinationCapacity',
              children: [
                {
                  name: 'combinationCapacitySetup',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default { routes, routeTree };
