<template>
  <span class="mp-tip">
    <el-tooltip class="el-tooltip"  v-bind="$attrs" >
       <slot></slot>
    </el-tooltip>
  </span>
</template>

<script lang="ts">
export default {
  name: 'MpTip',
  setup() {
    // 无
  },
};
</script>
<style lang="scss">
.mp-tip{
  width: 100%;
  display: inline-block;
  .el-only-child__content{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    width: 100%;
  }
}
</style>
