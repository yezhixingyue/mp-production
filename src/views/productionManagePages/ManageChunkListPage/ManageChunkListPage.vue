<template>
  <section class="page-wrap">
    <Header :condition="ManagePlateListPageData.condition" :list="ManagePlateListPageData.list" :lineList="ManagePlateListPageData.ProductionLineList"
     :getList="getList" :setCondition="setCondition" @clear="clearCondition" />
    <Main
     :list="ManagePlateListPageData.list"
     :loading="ManagePlateListPageData.loading" />
    <Footer :condition="ManagePlateListPageData.condition" :getList="getList" :total="ManagePlateListPageData.listNumber" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Header from './Comps/Header.vue';
import Main from './Comps/Main.vue';
import Footer from './Comps/Footer.vue';
import { ManageChunkListClass } from './js/ManageChunkListClass';

const ManagePlateListPageData = ref(new ManageChunkListClass());

const setCondition = (e) => { ManagePlateListPageData.value.setCondition(e); };

const clearCondition = () => { ManagePlateListPageData.value.clearCondition(); };

const getList = () => { ManagePlateListPageData.value.getList(); };

onMounted(() => { ManagePlateListPageData.value.getInitData(); });
</script>

<script lang="ts">
export default {
  name: 'ManageChunkListPage',
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
    padding-top: 7px;
  }
  > header, > footer {
    flex: none;
  }
  > header, > main, > footer {
    background-color: #fff;
  }
}
</style>
