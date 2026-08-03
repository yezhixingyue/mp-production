<!--  -->
<template>
  <LeftMenu v-if="displaySider && !fullAcreen" />
  <div class="mp-erp-layout-content-right-wrap">
    <LayoutHeader v-if="displaySider && !fullAcreen" />
    <div class="mp-erp-layout-page-content-comp-wrap"
    :class="{'no-padding height100 no-margin': isLogin, 'bg-white': isHome, 'print-view': isPrintView}">
      <div>
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LeftMenu from './LeftMenu.vue';
import LayoutHeader from './LayoutHeader.vue';

export default {
  name: 'LayoutComp',
  components: {
    LeftMenu,
    LayoutHeader,
  },
  setup() {
    const route = useRoute();

    // const displaySider = computed(() => route.meta.requiresAuth && process.env.VUE_APP_TARGET !== 'My Order App');
    const displaySider = computed(() => route.meta.requiresAuth);
    const fullAcreen = computed(() => route.meta.fullAcreen);

    const isLogin = computed(() => route.name === 'login' || route.name === 'client');
    const isPrintView = computed(() => route.name === 'digital-print');
    const isHome = computed(() => route.path === '/');
    return {
      isLogin,
      isPrintView,
      isHome,
      fullAcreen,
      displaySider,
    };
  },
};
</script>
<style lang='scss'>
.mp-erp-layout-page-content-comp-wrap{
  // padding: 20px 30px;
  height: calc(100vh - 41px);
  max-height: calc(100vh - 41px);
  overflow: auto;
  background-color: #F5F5F5;
  >div{
    min-width: 1000px;
    margin: 0 8px;
    height: 100%;
    overflow: hidden;
    &:has(.no-gap) {
      margin: 0;
    }
  }
  &.no-padding{
    padding: 0;
  }
  &.height100{
    height: 100vh;
    max-height: 100vh;
  }
  &.no-margin{
    >div{
      margin: 0;
    }
  }
  &.bg-white{
    background-color: white;
  }
  &.print-view {
    background-color: transparent;
    height: auto;
    max-height: unset;
    // overflow: hidden;

    > div {
      margin: 0;
      min-width: auto;
      // overflow-y: auto;
    }
  }
}

#app, .mp-erp-layout-content-right-wrap {
  &:has(.print-view) {
    min-height: 100vh;
    overflow: auto !important;
    height: unset !important;
  }
}
</style>
