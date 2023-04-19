<template>
  <section class="mp-prod-order-app-root-page-wrap">
    <header>
      <div class="menus">
        <nav v-if="validRoutes.length > 1">
          <menu v-for="it in validRoutes" :key="it.path" @click="onMenuItemClick(it, it.path)" :class="{active:route.name===it.name}">
            {{ it.meta?.title || it.path }}
          </menu>
        </nav>
      </div>
      <UserDropdownMenu showImgType />
    </header>
    <main>
      <CommonNullView />
    </main>
  </section>
</template>

<script setup lang='ts'>
import CommonNullView from '@/components/Layout/CommonNullView.vue';
import { setOrderAppJumpPath } from '@/router/modules/OrderAppRouteManage/utils';
import { onMounted, ref } from 'vue';
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router';
import UserDropdownMenu from '@/components/Layout/UserDropdownMenu/UserDropdownMenu.vue';
import { useLayoutStore } from '@/store/modules/layout';

const router = useRouter();

const route = useRoute();

const validRoutes = ref<RouteRecordRaw[]>([]);

const LayoutStore = useLayoutStore();

const onMenuItemClick = (route:RouteRecordRaw, index:string) => { // 跳转页面
  let _path = route.redirect || route.path;
  const targetTab = LayoutStore.editableTabs.find(it => it.name === index);
  if (targetTab) { // 处理页面路径变化后的情况
    _path = targetTab.path;
  }
  const t = LayoutStore.editableTabs.find(it => it.path === _path);

  if (t) {
    LayoutStore.setEditableTabsValue(t.name);
  } else {
    const name = index;
    const item = {
      title: route.meta?.title,
      name,
      path: _path as string,
      closable: true,
      isNew: true,
      pageName: route.meta?.pageName,
    };
    LayoutStore.addTabItem(item);
  }

  // 路由跳转
  router.push(_path as string);
};

onMounted(() => {
  validRoutes.value = setOrderAppJumpPath();

  if (validRoutes.value[0] && router.currentRoute.value.path === '/orderAppRoutes') router.replace(validRoutes.value[0].path);
});
</script>

<style scoped lang='scss'>
.mp-prod-order-app-root-page-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  > header {
    flex: none;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 6px;

    > .menus {

      nav {
        display: flex;

        menu {
          padding: 0 12px;
          position: relative;
          cursor: pointer;
          &::before {
            content: '|';
            position: absolute;
            left: 0;
            top: -1px;
            color: #444;
            font-weight: 400;
          }
          &:first-of-type {
            &::before {
              display: none;
            }
          }
          &:hover {
            color: #26bcf9;
            text-decoration: underline;
          }
        }
      }
      .active {
        color: #26bcf9;
        font-weight: 700;
        &:hover {
          text-decoration: none;
        }
      }
    }
  }
  > main {
    flex: 1;
    overflow: hidden;
  }
}
</style>
