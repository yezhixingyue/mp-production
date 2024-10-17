<template>
  <footer class="footer">
    <MpPagination center
      :nowPage="Page"
      :total="listNumber"
      :pageSize="PageSize"
      :handlePageChange="(num) => emit('getList', num)"
    >
    </MpPagination>
    <span class="is-blue-span excel" :class="{disabled:!listNumber}" @click="emit('excel')">导出Excel</span>
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';

defineProps<{
  Page: number
  PageSize: number
  listNumber: number
}>();

const emit = defineEmits(['getList', 'excel']);
</script>

<style scoped lang='scss'>
.footer {
  position: relative;
  padding: 5px 0;
}
.excel {
  position: absolute;
  right: 220px;
  top: 14px;
  font-size: 13px;
}

@media screen and (max-width: 1000px) {
  .excel {
    display: none;
  }
}
</style>
