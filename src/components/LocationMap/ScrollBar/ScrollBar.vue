<template>
  <!-- 右侧滚动条 -->
  <Bar class="scroll-bar bar-right" ref="oVBar" :class="{a:show.all}" v-if="show.v" vertical
   :innerSize="innerHeight" :outerSize="wrapSize.height" :start="position.top" @change="setPosition" />

  <!-- 底部横向滚动条 -->
  <Bar class="scroll-bar bar-bottom" ref="oHBar" :class="{a:show.all}" v-if="show.h"
   :innerSize="innerWidth" :outerSize="wrapSize.width" :start="position.left" @change="setPosition" />
</template>

<script setup lang='ts'>
import { computed, onActivated, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue';
import Bar from './Bar.vue';
import { useConfigForMap } from '../useConfigForMap';

const props = defineProps<{
  config: ReturnType<typeof useConfigForMap>['config']['value']
}>();

const oVBar = ref<InstanceType<typeof Bar>>();
const oHBar = ref<InstanceType<typeof Bar>>();

const innerWidth = computed(() => props.config.mapSize.width * props.config.scale);
const innerHeight = computed(() => props.config.mapSize.height * props.config.scale);

const diff = computed(() => ({
  left: ((props.config.scale - 1) * props.config.mapSize.width) / 2,
  top: ((props.config.scale - 1) * props.config.mapSize.height) / 2,
}));

const position = computed(() => ({
  left: props.config.position.left + diff.value.left,
  top: props.config.position.top + diff.value.top,
}));

const setPosition = ([val, vertical]: [number, boolean | undefined]) => {
  const _position = props.config.position;
  if (vertical) {
    _position.top = val - diff.value.top;
  } else {
    _position.left = val - diff.value.left;
  }
};

const wrapSize = ref({
  width: 0,
  height: 0,
});

const getWrapSize = () => {
  if (oHBar.value) {
    wrapSize.value.width = oHBar.value.$el.offsetWidth;
  }
  if (oVBar.value) {
    wrapSize.value.height = oVBar.value.$el.offsetHeight;
  }
};

const show = computed(() => {
  const h = innerWidth.value > wrapSize.value.width;
  const v = innerHeight.value > wrapSize.value.height;

  return { h, v, all: h && v };
});

watch(() => show.value, (newVal, oldVal) => {
  if (oldVal.h && !newVal.h) { // 水平方向滚动条消失 -- 设置水平居中
    setPosition([(innerWidth.value - wrapSize.value.width) / 2, false]);
    // setPosition([0, false]); // 等如果采用普通scale方式进行缩放时 重新启用上行行代码
  }
  if (oldVal.v && !newVal.v) { // 垂直方向滚动条消失 -- 设置垂直居中
    setPosition([(innerHeight.value - wrapSize.value.height) / 2, true]);
    // setPosition([0, true]);
  }
});

onMounted(() => {
  getWrapSize();

  window.addEventListener('resize', getWrapSize);
});

onActivated(() => {
  if (!wrapSize.value.width && !wrapSize.value.height) getWrapSize();

  window.addEventListener('resize', getWrapSize);
});

onDeactivated(() => {
  window.removeEventListener('resize', getWrapSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', getWrapSize);
});

</script>

<style scoped lang='scss'>
.scroll-bar {
  position: absolute;
  background-color: #f1f1f1;
  box-sizing: border-box;

  &.bar-right {
    width: 16px;
    height: calc(100% - 16px);
    right: 0;
    top: 0;
  }

  &.bar-bottom {
    height: 16px;
    width: calc(100% - 16px);
    bottom: 0;
    left: 0;

    &.a {
      &::after {
        content: '';
        position: absolute;
        background-color: #dcdcdc;
        right: -16px;
        top: 0;
        width: 16px;
        height: 100%;
      }
    }
  }
}
</style>
