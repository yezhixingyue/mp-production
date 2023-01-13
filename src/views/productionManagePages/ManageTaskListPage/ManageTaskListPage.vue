<template>
  <section class="page-wrap">
    <Header :ManageTaskListData="ManageTaskListData" />
    <Main :list="ManageTaskListData.list" :loading="ManageTaskListData.loading" />
    <Footer :condition="ManageTaskListData.condition" :getList="ManageTaskListData.getList" :total="ManageTaskListData.listNumber" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { ManageTaskListClass } from './js/ManageTaskListClass';
import Header from './Comps/Header.vue';
import Main from './Comps/Main.vue';
import Footer from './Comps/Footer.vue';

const ManageTaskListData = ref(new ManageTaskListClass());

onMounted(() => {
  ManageTaskListData.value.EquipmentFilterData.getInitData();
});
</script>

<script lang="ts">
export default {
  name: 'ManageTaskListPage',
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
