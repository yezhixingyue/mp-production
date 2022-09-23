<template>
  <span class="mp-tips" :class="{'is-pink':ispink,'is-gray':isgray,'is-orange':!ispink&&!isgray}">
    <el-icon v-if="!props.hideIcon"><WarningFilled /></el-icon>
    {{props.msg}}
  </span>
</template>

<script setup lang='ts'>
const props = withDefaults(defineProps<{
  msg: string,
  hideIcon?: boolean,
  ispink?: boolean,
  isgray?: boolean,
}>(), {
  hideIcon: false,
  ispink: false,
  isgray: false,
});

</script>

<style scoped lang='scss'>
.mp-tips {
  font-size: 12px;
  letter-spacing: 0.5px;
  white-space: nowrap;
  > i {
    font-size: 14px;
    margin-right: 5px;
    vertical-align: -2px;
  }
  &.is-gray {
    color: #aaa;
  }
}
</style>
