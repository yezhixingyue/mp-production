<template>
  <section class="page-wrap">
    <Header :condition="ManageOrderListPageData.condition" :list="ManageOrderListPageData.list" :lineList="ManageOrderListPageData.ProductionLineList"
     :getList="getList" :setCondition="setCondition" @clear="clearCondition" />
    <Main
     :list="ManageOrderListPageData.list"
     :loading="ManageOrderListPageData.loading"
     @top="handleOrderToTop"
     @toCustomizPlate="handleToCustomizPlate"
     @cancel="(e, cb) => ManageOrderListPageData.handleOrderCancel(e, cb)" />
    <Footer :condition="ManageOrderListPageData.condition" :getList="getList" :total="ManageOrderListPageData.listNumber" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Header from './Comps/Header.vue';
import Main from './Comps/Main.vue';
import Footer from './Comps/Footer.vue';
import { ManageOrderListClass } from './js/ManageOrderListClass';

const ManageOrderListPageData = ref(new ManageOrderListClass());

const setCondition = (e) => { ManageOrderListPageData.value.setCondition(e); };

const clearCondition = () => { ManageOrderListPageData.value.clearCondition(); };

const getList = (e) => { ManageOrderListPageData.value.getList(e); };

const handleOrderToTop = (id: string) => { ManageOrderListPageData.value.handleOrderToTop(id); }; // 订单置顶
const handleToCustomizPlate = (id: string) => { ManageOrderListPageData.value.handleToCustomizPlate(id); }; // 转自定义版

onMounted(() => { ManageOrderListPageData.value.getInitData(); });
</script>

<script lang="ts">
export default {
  name: 'ManageOrderListPage',
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
