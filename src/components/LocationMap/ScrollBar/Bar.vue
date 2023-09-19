<template>
  <div class="bar-box" :class="{vertical: vertical}">
    <el-icon :disabled="start <= 0" @click="onArrowClick(-1)"
     @dragstart.prevent.stop @mousedown="onBtnMousedown(-1)" @mouseleave="clearBtnMousedown" @mouseup="clearBtnMousedown"><CaretLeft /></el-icon>
    <div class="track" @click.self="onTrackClick">
      <div class="core"
        ref="oBarCore"
        :style="`
          ${vertical ? 'height' : 'width'}:${outerSize * 100 / innerSize}%;
          transform:${vertical ? `translate(0, ${localStart}px)` : `translate(${localStart}px, 0)`};
        `"
        @dragstart.prevent.stop
        @mousedown="onBarMousedown">
      </div>
    </div>
    <el-icon :disabled="start >= innerSize - outerSize" @click="onArrowClick(1)"
       @dragstart.prevent.stop @mousedown="onBtnMousedown(1)" @mouseleave="clearBtnMousedown" @mouseup="clearBtnMousedown"><CaretRight /></el-icon>
  </div>
</template>

<script setup lang='ts'>
import { computed, onActivated, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  innerSize: number,
  outerSize: number,
  start: number,
  vertical?: boolean
}>();

const emit = defineEmits(['change']);

const localStart = computed({
  get() {
    return props.start * ((props.outerSize - 32) / props.innerSize);
  },
  set(val) {
    let _val = val / ((props.outerSize - 32) / props.innerSize);
    if (_val < 0) _val = 0;

    const max = props.innerSize - props.outerSize;
    if (_val > max) _val = max;

    emit('change', [_val, props.vertical]);
  },
});

const onBarMousedown = () => { // 滚动条拖动事件
  let num = 0;

  const onmousemove = (e: MouseEvent) => {
    if (!num) {
      num = props.vertical ? e.y : e.x;
    } else {
      const newNum = props.vertical ? e.y : e.x;
      const d = newNum - num;

      localStart.value += d;

      num = newNum;
    }
  };

  const clearEvent = () => {
    num = 0;
    document.body.removeEventListener('mousemove', onmousemove);
    document.body.removeEventListener('mouseup', clearEvent);
    document.body.removeEventListener('mouseleave', clearEvent);
  };

  document.body.addEventListener('mousemove', onmousemove);
  document.body.addEventListener('mouseup', clearEvent);
  document.body.addEventListener('mouseleave', clearEvent);
};

const oBarCore = ref<HTMLDivElement>();

const onTrackClick = (e: MouseEvent) => { // 轨道点击事件
  if (!oBarCore.value) return;

  let num = 0;
  const _point = props.vertical ? e.offsetY : e.offsetX;
  const _coreSize = props.vertical ? oBarCore.value.offsetHeight : oBarCore.value.offsetWidth;

  if (_point < localStart.value) num = -1;
  if (_point > localStart.value + _coreSize) num = 1;

  if (!num) return;

  localStart.value += num * _coreSize;
};

const onArrowClick = (num: 1 | -1) => { // 两侧箭头点击事件
  const _step = 8 * num;
  localStart.value += _step;
};

let timer1: number | null = null;
let timer2: number | null = null;

const onBtnMousedown = (num: 1 | -1) => { // 两侧箭头长按事件
  timer1 = setTimeout(() => {
    timer2 = setInterval(() => {
      onArrowClick(num);
    }, 50);
  }, 300);
};
const clearBtnMousedown = () => {
  if (timer1 !== null) {
    clearInterval(timer1);
    timer1 = null;
  }
  if (timer2 !== null) {
    clearInterval(timer2);
    timer2 = null;
  }
};

const onWheelChange = (e: WheelEvent) => { // 滑轮滚动事件
  if (e.x <= 186 || ((e.target as HTMLElement).tagName !== 'CANVAS' && !(e.target as HTMLElement).className.includes('canvas-box'))) return; // 此时在左边按钮区域

  if (e.ctrlKey && !props.vertical) { // 横向
    onArrowClick(e.deltaY < 0 ? -1 : 1);
    e.preventDefault();
  } else if (!e.ctrlKey && !e.altKey && props.vertical) { // 纵向
    onArrowClick(e.deltaY < 0 ? -1 : 1);
    e.preventDefault();
  }
};

watch(() => `${props.start}${props.innerSize}`, () => { // 使用renderScale后 监听的对象从单一start改为了当前组合内容
  if (localStart.value < 0 || localStart.value / ((props.outerSize - 32) / props.innerSize) > (props.innerSize - props.outerSize)) {
    const num = localStart.value;
    localStart.value = num;
  }
}, { immediate: true });

let inited = false;
onMounted(() => {
  document.body.addEventListener('wheel', onWheelChange, { passive: false });
  inited = true;
});
onActivated(() => {
  if (!inited) return;
  document.body.addEventListener('wheel', onWheelChange, { passive: false });
});
onDeactivated(() => {
  document.body.removeEventListener('wheel', onWheelChange);
});
onUnmounted(() => {
  document.body.removeEventListener('wheel', onWheelChange);
});
</script>

<style scoped lang='scss'>
.bar-box {
  display: flex;
  align-items: center;
  // overflow: hidden;

  > i {
    flex: none;
    cursor: pointer;
    width: 16px;
    height: 16px;
    font-size: 12px;
    border-radius: 1px;
    &:active {
      background-color: #787878;
      color: #fff;
    }
    &[disabled="true"] {
      pointer-events: none;
      color: #aaa;
    }
    transition: 0.05s ease-in-out;
  }

  > div.track {
    flex: 1;
    overflow: hidden;

    .core {
      background-color: #c1c1c1;
      transition: background-color 0.05s ease-in-out;
      &:active {
        background-color: #787878;
      }
    }
  }

  &.vertical {
    flex-direction: column;
    > i {
      transform: rotate(90deg);
    }
    > div.track {
      width: 100%;
      .core {
        width: calc(100% - 4px);
        margin-left: 2px;
      }
    }
  }
  &:not(.vertical) {
    > div.track {
      height: 100%;
      .core {
        height: calc(100% - 4px);
        margin-top: 2px;
      }
    }
  }
}
</style>
