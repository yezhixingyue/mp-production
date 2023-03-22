<template>
  <div
     class="ball-box"
     ref="ballRef"
    :style="`transform: translate(${position.x}px, ${position.y}px);`"
    @mousedown="(e) => onballmousedown(e, ballRef)"
    >
    <span>有200单</span>
    <span>未送出</span>
  </div>
</template>

<script setup lang='ts'>
import {
  onMounted, onUnmounted, ref,
} from 'vue';
import {
  ondocumentmouseup, ondocumentmousemove, initPosition, onballmousedown, position,
} from './dragBall';

/* 拖动相关 ↓
------------------------------------ */
const ballRef = ref<InstanceType<typeof HTMLElement>>();

const bindEvent = () => { // 绑定拖动事件
  document.addEventListener('mouseup', ondocumentmouseup);
  document.addEventListener('mousemove', ondocumentmousemove);
  window.addEventListener('resize', initPosition);
};

const unbindEvent = () => { // 释放事件绑定
  document.removeEventListener('mouseup', ondocumentmouseup);
  document.removeEventListener('mousemove', ondocumentmousemove);
  window.removeEventListener('resize', initPosition);
};

onMounted(() => {
  bindEvent(); // 绑定拖动事件
});

onUnmounted(() => {
  unbindEvent(); // 释放事件绑定
});

</script>

<style scoped lang='scss'>
.ball-box {
  position: fixed;
  left: 30px;
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
  z-index: 999;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out, transform 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s;
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

@media screen and (min-width: 1400px) {
  .ball-box {
    left: calc(50vw - 640px - 75px);
  }
}
</style>
