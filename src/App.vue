<template>
  <LayoutComp />
</template>

<script lang='ts'>
import LayoutComp from '@/components/Layout/Index.vue';
import { useRouterStore } from '@/store/modules/routerStore';
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  components: {
    LayoutComp,
  },
  setup() {
    const RouterStore = useRouterStore();
    const Route = useRoute();
    watch(() => Route.path, () => {
      RouterStore.size = (document
        .documentElement.clientWidth + document
        .documentElement.clientHeight) + Route.path;
    });
    onMounted(() => {
      window.onresize = () => {
        RouterStore.size = (document
          .documentElement.clientWidth + document
          .documentElement.clientHeight) + Route.path;
      };
    });
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html, body {
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  > .mp-erp-layout-side-bar-comp-wrap {
    flex: none;
    width: 240px;
    height: 100vh;
    &.collapse{
      width: 64px;
      transition:width 300ms;
    }
  }
  > .mp-erp-layout-content-right-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100vh;
    background-color: #F5F5F5;
    > .mp-erp-layout-header-comp-wrap {
      flex: none;
      // height: 50px;
      width: 100%;
      // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
      border-bottom: 1px solid #d8dce5;
    }
    > .mp-erp-layout-page-content-comp-wrap {
      flex: 1;
    }
  }

}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
