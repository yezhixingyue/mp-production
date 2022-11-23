<template>
  <footer>
    <div class="box">
      共检索出 <i class="is-primary">{{props.listNumber}}</i> 条记录
    </div>
  </footer>
</template>

<script setup lang='ts'>
const props = defineProps<{
  listNumber: number
}>();
</script>

<style scoped lang='scss'>
.box {
  width: 945px;
  text-align: right;
  font-size: 13px;
  box-sizing: border-box;
  padding-right: 25px;
}
</style>
