<!-- 侧边栏 -->
<template>
  <div class="mp-erp-layout-side-bar-comp-wrap" :class="{'collapse': isCollapse}">
    <div class="logo">
      <img src="@/assets/images/logo.png" alt="">
    </div>

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="defaultActive"
        :default-openeds='defaultOpeneds'
        :collapse-transition='true'
        :collapse="isCollapse"
        class="el-menu-vertical-demo">
        <el-sub-menu
          v-for="(routeWrap, index) in menuList"
          :key="routeWrap.path" :index='`${index + 1}`'
          v-show="routeWrap.children.length > 0">
          <template #title>
            <i class="title-icon" :class="routeWrap.meta.icon"></i>
            <span>{{routeWrap.meta.title}}</span>
          </template>
          <el-menu-item
           :index="`${index + 1}-${i + 1}`"
           @click="onMenuItemClick(route, `${index + 1}-${i + 1}`)"
            v-for="(route, i) in routeWrap.children"
           :key="route.path"
           :class="{hidden: route.meta.hiddenItem}">
            <span v-if="route.meta" slot:title>{{route.meta.title}}</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>

    <!-- <template v-for="(routeWrap, index) in menuList" :key="routeWrap.path">
      <router-link :to="routeWrap.path">1{{routeWrap.meta.title}}</router-link>
      <template v-if="routeWrap.children && routeWrap.children.length">
        <button v-for="(route, i) in routeWrap.children" :key="route.path"
          @click="onMenuItemClick(route,`${index + 1}-${i + 1}`)"
          :style="defaultActive===`${index + 1}-${i + 1}`?'color:red;':''">
          {{route.meta.title}}
        </button>
      </template>
    </template>
    <router-link to="/">主页</router-link>
    <router-link to="/about">关于</router-link> -->
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
          children: _it.children.filter(child => child.meta && !child.meta.hideMenu), // 此处筛选权限
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

    return {
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
.mp-erp-layout-side-bar-comp-wrap {
  background-color: #222b3a;
  a {
    color: #fff;
    text-decoration: none;
    display: block;
    line-height:40px;
    font-size: 14px;
    &.router-link-active {
      color: rgb(38, 188, 249);
      background-color: #0e1727;
    }
  }
  > .logo {
    cursor: pointer;
    background-color: #242832;
    width: 100%;
    height: 84px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    line-height: 84px;
    padding: 6px;
    text-align: center;
  }
  .scrollbar-wrapper{
    font-size: 14px;
    .el-menu-vertical-demo{
      background-color: #242832;
      .el-sub-menu{
        .el-menu--inline{
          background-color: #161B26;
          .el-menu-item{
            color: #B8C6E0;
            border-left: 2px solid #161B26;
            padding-left: 86px;
            &.is-active{
              color: #fff;
              border-left: 2px solid #26BCF9;
              background:linear-gradient(to right,#428DFA, #124897);
            }
            &:hover{
              color: #fff;
              background-color: #5b7289;
            }
          }
        }
        .el-sub-menu__title{
          padding-left: 50px;
          padding-right: 43px;
          height: 50px;
          line-height: 50px;
          // background-color: #242832;
          color: #B8C6E0;
          .el-sub-menu__icon-arrow{
            right: 43px;
          }
          &:hover{
            background-color: #5b7289;
          }
        }
        &.is-active{
          .el-sub-menu__title{
            color: #fff;
            &:hover{
              background-color: #5b7289;
            }
          }
        }
        &.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow {
          transform: rotateZ(0deg);
        }
        &:not(.is-opened) {
          .el-sub-menu__title .el-sub-menu__icon-arrow  {
            transform: rotateZ(-90deg);
          }
        }
      }
      border: 0;
      .title-icon{
        // background-color:red;
        width:18px;
        height:18px;
        margin-right: 20px;
        line-height: 18px;
      }
    }
  }
}
</style>
