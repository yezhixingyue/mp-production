<!-- 侧边栏 -->
<template>
  <div class="mp-erp-layout-left-menu-comp-wrap" :class="isCollapse ? 'collapsed':'unfold'">
    <div class="logo-box" @click="onMenuItemClick(homeRouteInfo, '0')" @keyup="() => null">
      <img src="@/assets/images/logo.png" alt="" class="broad">
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="defaultActive" :default-openeds='defaultOpeneds' background-color="#222B3A" :collapse="isCollapse"
        :collapse-transition='true' text-color="#fff" class="el-menu-vertical-demo" active-text-color="#26bcf9">
        <el-sub-menu v-for="(routeWrap, index) in menuList" :key="routeWrap.path" :index='`${index + 1}`'
          v-show="routeWrap.children&&routeWrap.children.length > 0">
          <template v-slot:title>
            <i :class="routeWrap.meta?.icon" class="title-icon" v-show="isCollapse"></i>
            <span>{{routeWrap.meta?.title}}</span>
          </template>
          <el-menu-item
           :index="`${index + 1}-${i + 1}`"
           @click="onMenuItemClick(route, `${index + 1}-${i + 1}`)"
            v-for="(route, i) in routeWrap.children"
           :key="route.path"
           :class="{hidden: route.meta?.hiddenItem}">
            <i v-if="route.meta" :class="route.meta.icon"></i>
            <span v-if="route.meta">{{route.meta.title}}</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang='ts'>
import { moduleRoutes } from '@/router/modules/index';
import { RouteRecordRaw, useRouter, useRoute } from 'vue-router';
import { useLayoutStore } from '@/store/modules/layout/index';
import { computed, watch } from 'vue';
import { addBarType } from '@/store/modules/layout/addBarType';
import {
  getJudgmentWhetherIsSamePage,
  modulePageNames,
  getChildrenRouteNamesByParentRouteName,
} from '@/router/modules/getLastRouteInfoByName';

export default {
  setup() {
    const LayoutStore = useLayoutStore();
    const router = useRouter();
    const routeData = useRoute();
    const curRoute = computed(() => routeData);
    let defaultOpeneds:string[] = [];

    function getShowMenuList() { // 初始化获取左侧按钮列表
      if (!moduleRoutes || moduleRoutes.length === 0) return [];
      const list:RouteRecordRaw[] = moduleRoutes.filter(it => (!it.meta || !it.meta.hideMenu)
        && (it.meta && it.meta.icon)).map(_it => {
        if (!Array.isArray(_it.children)) return _it;
        return {
          ..._it,
          children: _it.children.filter(child => child.meta && child.meta.icon && !child.meta.hideMenu), // 此处筛选权限
        };
      });

      defaultOpeneds = list.map((it, i) => `${i + 1}`);
      return list;
    }
    // 获取左侧导航菜单列表
    const menuList = getShowMenuList();

    // 选中的tab
    const defaultActive = computed({
      get() {
        return LayoutStore.leftMenuDefaultActive;
      },
      set(val:string) {
        LayoutStore.setLeftMenuDefaultActive(val);
      },
    });
    const isCollapse = computed(() => LayoutStore.isCollapse);
    // 导航的点击事件处理函数
    function onMenuItemClick(route:RouteRecordRaw, index:string) {
      if (index) defaultActive.value = index;
      let _path = route.redirect || route.path; // 此处报错
      const targetTab = LayoutStore.editableTabs.find(it => it.name === index);
      if (targetTab) { // 处理页面路径变化后的情况
        _path = targetTab.path;
      }
      const t = LayoutStore.editableTabs.find(it => it.path === _path);

      if (t) {
        LayoutStore.setEditableTabsValue(t.name);
      } else {
        const name = index;
        const item:addBarType = {
          title: route.meta?.title as string | undefined,
          name,
          path: _path as string,
          closable: true,
          isNew: true,
          pageName: route.meta?.pageName as string | undefined,
        };
        LayoutStore.addTabItem(item);
      }

      // 路由跳转
      router.push(_path as string);
    }
    // 除去首页或matched.length = 1的除外  获取到该路径的activeName值和对应的路由信息(筛选处理过后)
    function getNormalActiveResult(route) {
      const { matched } = route;

      if (matched.length >= 2) {
        const m1 = matched[0];
        const index1 = menuList.findIndex(it => it.path === m1.path);
        if (!index1 && index1 !== 0) return null;
        const m2 = matched[1];
        const index2 = menuList[index1]?.children?.findIndex(it => it.path === m2.path);

        if (!index2 && index2 !== 0) return null;
        const targetRoute = menuList[index1].children;
        return {
          activeName: `${index1 + 1}-${index2 + 1}`,
          targetRoute: targetRoute ? targetRoute[index2] : undefined,
        };
      }
      return null;
    }

    function setInitMenuDefaultActive(route, bool = false) {
      const { matched } = route;
      if (matched.length >= 2) {
        const result = getNormalActiveResult(route);
        if (result) {
          const { activeName, targetRoute } = result;
          defaultActive.value = activeName;
          if (bool) onMenuItemClick(targetRoute as RouteRecordRaw, activeName);
        }
      } else if (route.path === '/') {
        defaultActive.value = '0';
        if (bool) onMenuItemClick(route as RouteRecordRaw, String(defaultActive.value));
      }
    }

    // 动态改变活动菜单索引 ----- 只刷新初始化时执行一次
    watch(curRoute.value, (newRoute) => {
      // 由于监听不到 oldRoute 值所以手动保存 oldRoute 到 LayoutStore 中

      const { oldRoute } = LayoutStore;
      // 借用展开操作符实现去除响应式
      const { ...newRouteData } = newRoute;
      const bool = getJudgmentWhetherIsSamePage(newRoute, oldRoute);
      LayoutStore.oldRoute = newRouteData;
      if (bool) {
        // 相同最小页面模块内调整
        if (defaultActive.value === LayoutStore.editableTabsValue) {
          // 修改目标路径名称 newRoute.path   另 借用store中this.editableTabsValue值
          // this.$store.commit('layout/changeCurTabPath', newRoute.path);
          LayoutStore.changeCurTabPath(newRoute.path);
        }
        if (!modulePageNames.includes(newRoute.name)) {
          // newRoute 为响应式类型 不深复制的时候 路由改变状态管理内的值 otherTabPageNames 就会改变
          LayoutStore.setOtherTabPageNames(newRouteData);
        }
      }

      const names = getChildrenRouteNamesByParentRouteName(newRoute.name as string);
      if (Array.isArray(names)) {
        // this.$store.commit('layout/filterOtherTabPageNames', names);
        LayoutStore.filterOtherTabPageNames(names);
      }
      if (defaultActive.value || !menuList || menuList.length === 0) return;

      setInitMenuDefaultActive(newRoute, true);
    }, { immediate: true, deep: true });
    // 动态改变活动菜单索引 ----- 只刷新初始化时执行一次

    const homeRouteInfo: RouteRecordRaw = { // 用于logo点击使用
      meta: {
        title: '首页',
      },
      path: '/',
      redirect: '/',
    };

    return {
      homeRouteInfo,
      defaultOpeneds,
      menuList,
      isCollapse,
      onMenuItemClick,
      defaultActive,
    };
  },
};
</script>
<style lang='scss'>
  .mp-erp-layout-left-menu-comp-wrap{
    width: 186px;
    background-color: rgb(34, 43, 58);
    font-size: 14px;
    flex: none;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    transition: width 0.3s ease-in-out;
    a {
      text-decoration: none;
    }
    > div.logo-box {
      cursor: pointer;
      background-color: rgb(25, 31, 42);
      width: 100%;
      height: 47px;
      box-sizing: border-box;
      text-align: center;
      line-height: 47px;
      padding: 6px;
      img {
        vertical-align: -5px;
      }
    }
    .el-menu {
      border: none;
    }
    .el-scrollbar {
      .el-scrollbar__wrap {
        overflow: hidden;
        overflow-y: auto;
        padding-bottom: 30px;
        // width: 100%;
        .el-scrollbar__view {
          max-width: 186px;
        }
      }
    }

    p.login-out-box {
      width: 100%;
      padding: 15px 18px;
      box-sizing: border-box;
      cursor: pointer;
      background-color: rgb(34, 43, 58);
      color: #fff;
      // padding-bottom: 40px;
      // margin: 20px 0;
      margin-top: 20px;
      &:hover {
        background-color: rgb(54, 66, 88);
      }
      &:active {
        background-color: rgb(15, 29, 53);
      }
      display: flex;
      align-items: center;
      // justify-content: center;
      white-space: nowrap;
      > i {
        font-size: 18px;
        margin-right: 5px;
        &.not-c {
          margin-right: 12px;
        }
      }
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 100%;
      min-height: 400px;
      min-height: calc(100vh - 120px);
      .el-sub-menu .el-menu-item {
        width: 100%;
        height: 42px;
        line-height: 42px;
        box-sizing: border-box;
        min-width: unset;
        background-color: rgb(15, 29, 53);
        transition: 0.05s ease-in-out;
        user-select: none;
        > i {
          margin-right: 5px;
        }
        .iconfont {
            font-size: 15px;
            margin-left: 4px;
            margin-right: 10px;
          }
        > i, > span {
          color: #fff;
        }
        &:hover {
          background-color: rgb(38, 188, 249) !important;
          background-color: rgb(14, 23, 39) !important;
          > i, > span {
            color: #fff;
          }
        }
        &.is-active {
          background-color: rgb(14, 23, 39) !important;
          > i, > span {
            color: #fff;
            color: rgb(38, 188, 249) !important;
          }
        }
        &.hidden {
          display: none;
        }
      }
    }
    &:not(.collapsed) {
      .el-sub-menu__title > i:last-of-type {
        transform: rotateZ(-90deg) !important;
        margin-top: -8px;
      }
    }
    .el-sub-menu__title {
      background-color: rgb(15, 29, 53) !important;
      height: 42px;
      line-height: 38px;
      user-select: none;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 0px;
        background-color: rgb(38, 188, 249);
        transition: width 0.1s ease-in-out;
      }
      &:hover {
        color: rgb(38, 188, 249) !important;
        &::before {
          width: 2px;
        }
        > i.title-icon {
          color: rgb(38, 188, 249) !important;
        }
      }
      > i {
        font-size: 17px;
        color: #fff;
        &.title-icon {
          margin-left: -2px !important;
          transition: color 0.1s ease-in-out;
        }
      }
    }
    .el-sub-menu.is-opened > .el-sub-menu__title{
      .el-sub-menu__icon-arrow {
        transform: rotateZ(0deg) !important;
      }
    }
    &.collapsed {
      width: 55px;
    }
    .login-out-box.show{
      animation: hiddenFrames 0.6s ease-in-out;
    }
    @keyframes hiddenFrames {
      from {
        opacity: 1;
      };
      1% {
        opacity: 0;
      };
      99% {
        opacity: 0;
      };
      to {
        opacity: 1;
      }
    }
  }
  .el-menu .el-menu-item > i.el-icon {
    margin-right: 0;
  }
  .el-menu--vertical > .el-menu .el-menu-item > i.el-icon {
    text-align: left;
    margin-left: 5px;
  }
  .el-menu--popup-container {
    .el-menu-item {
      i {
        margin-right: 10px;
      }
    }
  }
</style>
