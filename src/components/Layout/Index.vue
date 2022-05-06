<!--  -->
<template>
  <SideBar v-if="displaySider" />
  <div class="mp-erp-layout-content-right-wrap">
    <LayoutHeader v-if="displaySider" />
    <div class="mp-erp-layout-page-content-comp-wrap">
      <router-view/>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SideBar from './SideBar.vue';
import LayoutHeader from './LayoutHeader.vue';

export default {
  name: 'LayoutComp',
  components: {
    SideBar,
    LayoutHeader,
  },
  setup() {
    console.log('setup');
    const route = useRoute();

    const displaySider = computed(() => route.meta.requiresAuth);

    console.log(route, displaySider);

    return {
      displaySider,
    };
  },
};
</script>
<style lang='scss'>
</style>
