<!--  -->
<template>
  <LeftMenu v-if="displaySider && !fullAcreen" />
  <div class="mp-erp-layout-content-right-wrap">
    <LayoutHeader v-if="displaySider && !fullAcreen" />
    <div class="mp-erp-layout-page-content-comp-wrap" :class="{'no-padding height100 no-margin': isLogin}">
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

    const displaySider = computed(() => route.meta.requiresAuth);
    const fullAcreen = computed(() => route.meta.fullAcreen);

    const isLogin = computed(() => route.name === 'login');
    return {
      isLogin,
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
  overflow-y: auto;
  overflow-x: hidden;
  >div{
    // background-color: #fff;
    margin: 0 8px;
    height: 100%;
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
}
</style>
