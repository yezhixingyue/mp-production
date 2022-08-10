<template>
  <!-- <keep-alive> -->
    <!-- <router-view /> -->
  <!-- </keep-alive> -->
  <TransitionRouterView />
</template>

<script>
import TransitionRouterView from '@/components/Layout/TransitionRouterView.vue';

export default {
  components: {
    TransitionRouterView,
  },
};
</script>
<style lang='scss'>
</style>
