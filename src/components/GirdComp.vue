<!--  -->
<template>
  <div class="gird-display-comp-wrap">
    <div style="background-color: #19caad" class="one">1</div>
    <div style="background-color: #8cc7b5" class="two">2</div>
    <div style="background-color: #d1ba74" class="three">3</div>
    <div style="background-color: #bee7e9" class="four">4</div>
    <div style="background-color: #e6ceae" class="five">5</div>
    <div style="background-color: #ecad9e; grid-column-start: span 2;" class="six">6</div>
    <div style="background-color: #e6ceae" class="seven">7</div>
    <div style="background-color: #ecad9e" class="eight">8</div>
    <div style="background-color: #ecad9e" class="nine">9</div>
  </div>
</template>

<script lang='ts'>
export default {
  setup() {
    console.log('setup');
  },
};
</script>
<style lang='scss'>
.gird-display-comp-wrap {
  // width: 800px;
  // height: 500px;
  // margin: 0 auto;
  // overflow: hidden;
  border: 1px solid black;
  display:inline-grid;
  grid-template-columns: 200px 300px;
  grid-template-rows: 100px 300px;
  // grid-auto-columns: 150px;
  grid-auto-columns: 50px;
  grid-auto-rows: 50px;
  grid-auto-flow: row dense;
  // grid-template-areas:
  //     "sidebar header header" // .代表的空的单元格，也就是没有用到该单元格
  //     "sidebar content content";
  gap: 20px;
  > div {
    // &.one {
    //   grid-area: header;
    // }
    // &.two {
    //   grid-area: sidebar;
    // }
    // &.three {
    //   grid-area: content;
    // }
    color: #fff;
    font-weight: 700;
    font-size: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 200px;
  }
}
</style>
