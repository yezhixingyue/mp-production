<template>
  <section class="page-wrap">
    <BasicDetailViewCompView v-if="PDODetailViewStore" :detail="PDODetailViewStore.craftResolveDetail" :rowItem="PDODetailViewStore.rowItem" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted } from 'vue';
import { PDODetailViewStore } from './store';
import BasicDetailViewCompView from '../_DetailViewComp/BasicDetailViewCompView.vue';

onMounted(() => {
  // 获取详情信息
  if (PDODetailViewStore.value) {
    PDODetailViewStore.value.getCraftResolveDetail();
  }
});
</script>

<script lang="ts">
export default {
  name: 'ProcessDecompositionOrderDetailView',
};
</script>

<style scoped lang='scss'>
.page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  > main {
    flex: 1;
    margin-top: 8px;
    overflow: hidden;
    > :deep(.el-table) {
      height: 100%;
    }
  }
  > footer {
    height: 40px;
    padding: 7px 0 3px 0;
  }
  > header, > footer {
    flex: none;
  }
  > header, > main, > footer {
    background-color: #fff;
  }
}
</style>
