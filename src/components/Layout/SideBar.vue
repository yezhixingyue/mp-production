<!-- 侧边栏 -->
<template>
  <div class="mp-erp-layout-side-bar-comp-wrap">
    <div class="logo">
      <img src="@/assets/images/logo.png" alt="">
    </div>
    <router-link to="/">主页</router-link>
    <router-link to="/about">关于</router-link>
  </div>
</template>

<script lang='ts'>
export default {
  setup() {
    // console.log('setup');
  },
};
</script>
<style lang='scss'>
.mp-erp-layout-side-bar-comp-wrap {
  background-color: #222b3a;
  a {
    color: #fff;
    text-decoration: none;
    display: block;
    line-height:40px;
    font-size: 14px;
    &.router-link-active {
      color: rgb(38, 188, 249);
      background-color: #0e1727;
    }
  }
  > .logo {
    cursor: pointer;
    background-color: #191f2a;
    width: 100%;
    height: 47px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    line-height: 47px;
    padding: 6px;
  }
}
</style>
