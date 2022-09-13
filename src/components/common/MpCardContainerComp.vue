<template>
  <!-- card -->
  <div class="mp-card-container"
    :class="className">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    TopAndButtomPadding: {
      type: Number,
      default: 0,
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
  box-sizing: border-box;
  overflow: hidden;
}
</style>
