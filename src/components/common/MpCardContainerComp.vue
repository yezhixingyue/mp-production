<template>
  <!-- card -->
  <div class="mp-card-container"
    :class="className"
    :style="`padding:${TopAndButtomPadding}px 20px`">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    TopAndButtomPadding: {
      type: Number,
      default: 20,
    },
    className: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang='scss'>
.mp-card-container{
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
