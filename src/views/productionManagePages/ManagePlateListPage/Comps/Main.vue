<template>
  <main>
    main
  </main>
</template>

<script setup lang='ts'>
import { IManagePlateInfo } from '../js/type';

defineProps<{
  list: IManagePlateInfo[]
  loading: boolean
}>();

</script>

<style scoped lang='scss'>
</style>
