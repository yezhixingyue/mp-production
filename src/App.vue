<template>
  <LayoutComp />
</template>

<script lang='ts'>
import LayoutComp from '@/components/Layout/Index.vue';

export default {
  components: {
    LayoutComp,
  },
  // mounted() {
  //   window.addEventListener('popstate', () => {
  //     console.log(document.URL, window.location.href, '11111111111111');
  //     // eslint-disable-next-line no-restricted-globals
  //     history.pushState(null, '', document.URL);
  //   // goBackLastPage();
  //   });
  // },
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
    background-color: #f5f9fc;
    > .mp-erp-layout-header-comp-wrap {
      flex: none;
      height: 50px;
      width: 100%;
      // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
      border-bottom: 1px solid #d8dce5;
    }
    > .mp-erp-layout-page-content-comp-wrap {
      flex: 1;
    }
  }
  .el-button{
    .iconfont{
      font-size: 12px;
      // background-color: red;
      margin-right: 5px;
    }
  }
  .required::before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
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
