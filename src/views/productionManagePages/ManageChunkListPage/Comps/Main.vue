<template>
  <main>
    main
  </main>
</template>

<script setup lang='ts'>
import { IManageChunkInfo } from '../js/type';

defineProps<{
  list: IManageChunkInfo[]
  loading: boolean
}>();

</script>

<style scoped lang='scss'>
</style>
