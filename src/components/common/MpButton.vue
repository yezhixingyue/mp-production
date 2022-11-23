<template>
  <el-button v-blur v-bind="$attrs" class="mp-button">
    <slot></slot>
  </el-button>
</template>

<script lang="ts">
export default {
  name: 'MpButton',
  setup() {
    // 无
  },
  directives: {
    blur: {
      mounted(el: HTMLElement) {
        document.addEventListener('mouseup', () => {
          el.blur();
        });
      },
    },
  },
};
</script>
<style scoped lang="scss">
.is-disabled.mp-button.is-link {
  color: #cbcbcb !important;
}
</style>
