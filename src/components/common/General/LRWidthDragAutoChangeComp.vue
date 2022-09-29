<template>
  <section class="mp-erp-common-comps-left-and-right-width-drap-auto-change-comp-wrap" ref="oWrap">
    <div class="left mp-scroll-wrap" :style="`width:${leftW}`" ref="oLeft">
      <slot name="left"></slot>
    </div>
    <span v-if="!single" class="vertical-line" @mousedown="onLineDown" :class="moving?'moving':''"><i></i></span>
    <div class="right mp-scroll-wrap">
      <slot name="right"></slot> <!-- 使用方式： <template v-slot:right><p>右侧区域</p></template> -->
    </div>
  </section>
</template>

<script>
export default {
  props: {
    leftWidth: {
      type: String,
      default: '49%',
    },
    single: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      leftW: '48%',
      offsetWidth: 0,
      oLeft: null,
      moving: false,
      distance: 7,
      initPageX: 0,
    };
  },
  methods: {
    onLineDown(e) {
      if (!this.oLeft && this.$refs.oLeft) this.oLeft = this.$refs.oLeft;
      if (this.oLeft) {
        this.offsetWidth = this.oLeft.offsetWidth;
        document.addEventListener('mousemove', this.onLineMove);
        document.addEventListener('mouseup', this.onLineUp);
        this.moving = true;
        this.distance = e.offsetX;
        this.initPageX = e.pageX;
      }
      e.preventDefault();
    },
    onLineMove(e) {
      this.leftW = `${e.pageX - this.initPageX - this.distance + this.offsetWidth}px`;
    },
    onLineUp() {
      document.removeEventListener('mousemove', this.onLineMove);
      document.removeEventListener('mouseup', this.onLineUp);
      this.moving = false;
    },
  },
  created() {
    this.leftW = this.leftWidth;
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-left-and-right-width-drap-auto-change-comp-wrap {
  width: 100%;
  display: flex;
  height: 100%;
  > div {
    height: 100%; // 临时
    overflow: auto;
    &.left {
      flex: none;
    }
    &.right {
      flex: 1;
    }
  }
  > .vertical-line {
    width: 12px;
    flex: none;
    display: flex;
    justify-content: center;
    > i {
      width: 1px;
      height: 100%;
      border-left: 1px solid #eee;
    }
    &:hover {
      cursor: w-resize;
      > i {
        border-left: 1px solid #cbcbcb;
      }
    }
    &.moving:hover > i {
      border-left: 1px solid #aaa;
    }
  }
}
</style>
