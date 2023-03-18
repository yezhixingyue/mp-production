<template>
  <router-view v-slot="{ Component }">
    <transition :name="!atRefreshing ? 'fade-transform' : ''"
      mode="out-in" @before-leave="beforeLeave" @after-enter="afterEnter">
      <keep-alive :include='[...curTabPagesNameList]'>
        <component :is="Component" :key="Component ? Component.key : ''" v-if="!refreshing" v-show="!atRefreshing"></component>
      </keep-alive>
    </transition>
  </router-view>

  <!-- <router-view v-slot="{ Component, route }">
    <transition
    @before-leave="beforeLeave"
    @after-enter="afterEnter"
    name="fade-transform"
    mode="out-in">
      <keep-alive>
        <component
          :is="Component"
          :key="route.path"
        />
      </keep-alive>
    </transition>
  </router-view> -->
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLayoutStore } from '@/store/modules/layout/index';
import { refreshing, atRefreshing } from './index';

export default {
  setup() {
    const LayoutStore = useLayoutStore();
    let dom = null;
    const route = useRoute();
    function setThisDom() {
      if (!dom) {
        const dom1 = document.querySelector('#app > section > main.page-wrap');
        if (!dom) return false;
        dom = dom1;
      }
      return true;
    }

    function beforeLeave() {
      if (!setThisDom()) return;
      dom.style.overflow = 'hidden';
    }
    function afterEnter() {
      if (!setThisDom()) return;
      dom.style.overflow = 'auto';
      dom.style.overflow = 'overlay';
    }

    const pageName = computed(() => {
      if (route.meta.pageName) return route.meta.pageName;
      let _name = '';
      if (route.matched && route.matched.length > 1) {
        route.matched.forEach(match => {
          if (match.meta.pageName) _name = match.meta.pageName;
        });
      }
      return _name;
    });

    const key = computed(() => route.path);
    const curTabPagesNameList = computed(() => LayoutStore.curTabPagesNameList.filter(it => !refreshing.value || it !== pageName.value));

    return {
      refreshing,
      atRefreshing,
      beforeLeave,
      afterEnter,
      setThisDom,
      key,
      pageName,
      curTabPagesNameList,
    };
  },
  // computed: {
  //   key() {
  //     return this.$route.path;
  //   },
  //   pageName() {
  //     if (this.$route.meta.pageName) return this.$route.meta.pageName;
  //     let _name = '';
  //     if (this.$route.matched && this.$route.matched.length > 1) {
  //       this.$route.matched.forEach(match => {
  //         if (match.meta.pageName) _name = match.meta.pageName;
  //       });
  //     }
  //     return _name;
  //   },
  // },
};
</script>
<style lang='scss'>
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.23s ease-in-out;
  overflow: hidden;
  user-select: none;
  width: 100%;
  pointer-events: none;
  max-width: none;
  box-sizing: border-box;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
