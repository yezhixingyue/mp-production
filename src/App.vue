<template>
  <el-config-provider :locale="zhCn">
    <LayoutComp />
  </el-config-provider>
</template>

<script lang='ts' setup>
import LayoutComp from '@/components/Layout/Index.vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// import { Example } from './assets/js/decorator/_Example';

// const testDecorator = async () => {
//   const obj = new Example();

//   obj.Sex = 2;

//   const bool = await obj._validate();
//   console.log(obj, bool);
// };

// testDecorator();

</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

html,
body {
  width: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: MicrosoftYaHei, '微软雅黑', Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #444;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;

  >.mp-erp-layout-content-right-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100vh;
    background-color: #F5F5F5;

    >.mp-erp-layout-header-comp-wrap {
      flex: none;
      // height: 50px;
      width: 100%;
      // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
      border-bottom: 1px solid #d8dce5;
    }

    >.mp-erp-layout-page-content-comp-wrap {
      flex: 1;
    }
  }

}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #444;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}</style>
