<template>
  <section class="page-wrap" v-if="PDOListManageStore">
    <Header
      :condition="PDOListManageStore.condition"
      :setCondition="PDOListManageStore.condition.setConditon.bind(PDOListManageStore.condition)"
      :clearCondition="PDOListManageStore.clearCondition.bind(PDOListManageStore)"
      :getList="PDOListManageStore.getList.bind(PDOListManageStore)"
      :list="PDOListManageStore.list"
      :ProductionLineData="PDOListManageStore.ProductionLineData"
    />

    <main>
      <Table :list="PDOListManageStore.list" :loading="PDOListManageStore.loading" :lineListData="PDOListManageStore.ProductionLineData" />
    </main>

    <Footer :condition="PDOListManageStore.condition" :total="PDOListManageStore.listNumber" :getList="PDOListManageStore.getList.bind(PDOListManageStore)" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, onUnmounted } from 'vue';
import { PDOListManageStore } from './store';
import { PDOListManageClass } from './js/PDOListManageClass';
import Header from './components/Header.vue';
import Table from './components/Table.vue';
import Footer from './components/Footer.vue';

onMounted(() => {
  PDOListManageStore.value = new PDOListManageClass();
  PDOListManageStore.value.init();
});

onUnmounted(() => {
  PDOListManageStore.value = null;
});
</script>

<script lang="ts">
export default {
  name: 'ProcessDecompositionOrderListView',
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
