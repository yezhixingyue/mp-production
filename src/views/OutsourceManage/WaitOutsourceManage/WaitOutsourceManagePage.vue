<template>
  <section class="page-wrap">
    <Header
      :condition="ManageListData.condition"
      :setCondition="ManageListData.condition.setConditon.bind(ManageListData.condition)"
      :clearCondition="ManageListData.clearCondition.bind(ManageListData)"
      :getList="ManageListData.getList.bind(ManageListData)"
      :list="ManageListData.list"
      :FactoryList="ManageListData.FactoryList"
      :options="ManageListData.options"
    />
    <Main :ManageListData="ManageListData" :pageType="pageType" />
    <Footer :ManageListData="ManageListData" :pageType="pageType" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Header from '../Comps/Header.vue';
import Main from '../Comps/Main.vue';
import Footer from '../Comps/Footer.vue';
import { ManageListClass } from '../js/ManageListClass';
import { OutsourceManagePageType } from '../js/type';

const pageType: OutsourceManagePageType = 'await';

const ManageListData = ref(new ManageListClass(pageType));

onMounted(() => {
  ManageListData.value.getList();
});

</script>

<script lang="ts">
export default {
  name: 'WaitOutsourceManagePage',
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
      margin-top: 0;
    }
  }
  > footer {
    height: 95px;
    box-sizing: border-box;
    padding: 12px 0 3px 0;
  }
  > header, > footer {
    flex: none;
  }
  > header, > main, > footer {
    background-color: #fff;
  }
}
</style>
