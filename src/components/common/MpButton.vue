<template>
  <el-button v-blur v-bind="$attrs" class="mp-button" ref="btnRef">
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
      mounted(el: Element) {
        el.addEventListener('focus', (e) => {
          if (e.target && e.target instanceof HTMLElement) {
            const getTargetDom = (dom: HTMLElement) => {
              if (dom.nodeName === 'BUTTON' && dom.className.includes('mp-button')) {
                return dom;
              }
              return dom.parentNode instanceof HTMLElement ? getTargetDom(dom.parentNode) : null;
            };

            const t = getTargetDom(e.target);

            if (t) t.blur();
          }
        });
      },
    },
  },
};
</script>
<style scoped lang="scss">
</style>
