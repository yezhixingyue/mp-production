<!--  -->
<template>
  <LeftMenu v-if="displaySider" />
  <div class="mp-erp-layout-content-right-wrap">
    <LayoutHeader v-if="displaySider" />
    <div class="mp-erp-layout-page-content-comp-wrap">
      <router-view/>
    </div>
  </div>
</template>
container

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
    return {
      displaySider,
    };
  },
};
</script>
<style lang='scss'>
.mp-erp-layout-page-content-comp-wrap{
  padding: 20px 30px;
  height: calc(100vh - 51px);
  max-height: calc(100vh - 51px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
