<template>
  <div class="ball-box" @dragstart="ondragstart">
    <span>有200单</span>
    <span>未送出</span>
  </div>
</template>

<script setup lang='ts'>
const ondragstart = (e: DragEvent) => {
  console.log('ondragstart', e.clientX);
};

</script>

<style scoped lang='scss'>
.ball-box {
  position: absolute;
  left: -75px;
  top: 130px;
  width: 75px;
  height: 75px;
  background-color: #ff0000;
  border-radius: 50%;
  text-align: center;
  color: #fff;
  box-shadow: 0px 5px 15px rgba($color: #ff0000, $alpha: 0.5);
  box-shadow: 0px 3px 6px 1px rgba(152,0,0,0.3);
  font-size: 16px;
  line-height: 22px;
  box-sizing: border-box;
  padding-top: 17px;
  cursor: pointer;
  transition: 0.1s ease-in-out;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  span {
    display: block;
    white-space: nowrap;
    font-weight: 700;
    user-select: none;
  }
  &:hover {
    background-color: lighten($color: #ff0000, $amount: 15);
  }
  &:active {
    opacity: 1;
    background-color: darken($color: #ff0000, $amount: 5);
  }
}
</style>
