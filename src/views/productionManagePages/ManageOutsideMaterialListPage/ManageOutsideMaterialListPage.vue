<template>
  <section class="page-wrap">
    <Header
      :condition="ManageOutsideMaterialListData.condition"
      :setCondition="ManageOutsideMaterialListData.condition.setConditon.bind(ManageOutsideMaterialListData.condition)"
      :clearCondition="ManageOutsideMaterialListData.clearCondition.bind(ManageOutsideMaterialListData)"
      :getList="ManageOutsideMaterialListData.getList.bind(ManageOutsideMaterialListData)"
      :list="ManageOutsideMaterialListData.list"
    />
    <Main
      :list="ManageOutsideMaterialListData.list"
      :loading="ManageOutsideMaterialListData.loading"
      :handleDelivery="ManageOutsideMaterialListData.setReceived.bind(ManageOutsideMaterialListData)"
    />
    <Footer
      :condition="ManageOutsideMaterialListData.condition"
      :total="ManageOutsideMaterialListData.listNumber"
      :getList="ManageOutsideMaterialListData.getList.bind(ManageOutsideMaterialListData)"
    />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Header from './Comps/Header.vue';
import Main from './Comps/Main.vue';
import Footer from './Comps/Footer.vue';
import { ManageOutsideMaterialListClass } from './js/ManageOutsideMaterialListClass';

const ManageOutsideMaterialListData = ref(new ManageOutsideMaterialListClass());

onMounted(() => { ManageOutsideMaterialListData.value.getList(); });

</script>

<script lang="ts">
export default {
  name: 'ManageOutsideMaterialListPage',
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
