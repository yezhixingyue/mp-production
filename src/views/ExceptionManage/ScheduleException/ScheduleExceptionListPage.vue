<template>
  <section class="page-wrap">
    <Header
      :condition="ManageListData.condition"
      :setCondition="ManageListData.condition.setConditon.bind(ManageListData.condition)"
      :clearCondition="ManageListData.clearCondition.bind(ManageListData)"
      :getList="ManageListData.getList.bind(ManageListData)"
      :list="ManageListData.list"
    />
    <Main
      :list="ManageListData.list"
      :loading="ManageListData.loading"
      @setTableRef="(multipleTableRef) => ManageListData.setMultipleTableRef(multipleTableRef)"
      @select="(rows) => ManageListData.setSelectList(rows)"
      @setHaveDeal="(row) => ManageListData.setRowsHaveDeal([row])"
     />
    <Footer :ManageListData="ManageListData" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Header from './Comps/Header.vue';
import Main from './Comps/Main.vue';
import Footer from './Comps/Footer.vue';
import { ManageListClass } from './js/ManageListClass';

// eslint-disable-next-line no-undef
defineOptions({
  name: 'ScheduleExceptionListPage',
});

const ManageListData = ref(new ManageListClass());

onMounted(() => { ManageListData.value.getList(); });
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
