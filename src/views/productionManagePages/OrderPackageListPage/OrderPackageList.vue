<template>
  <section class="page-wrap">
    <Header :condition="getPackageListData" :getList="getList" :setCondition="setCondition" @clear="clearCondition" />
    <PackageListTable  showHeader :packageList="packageList"/>
    <Footer :condition="getPackageListData" :getList="getList" :total="getPackageListData.total" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { IPackageList } from '@/views/ChangeLabelPage/types';
import api from '@/api';
import PackageListTable from './Comps/PackageListTable.vue';
import Header from './Comps/Header.vue';
import Footer from './Comps/Footer.vue';
import { Condition } from './js/Condition';

const getPackageListData = ref(new Condition());
const packageList = ref<IPackageList[]>([]);

const setCondition = ([[key1, key2], val]) => {
  if (key2) {
    getPackageListData.value[key1][key2] = val;
  } else {
    getPackageListData.value[key1] = val;
  }
};
const clearCondition = () => {
  getPackageListData.value = new Condition();
};

const getList = async (Page = 1) => {
  getPackageListData.value.Page = Page;
  const temp = getPackageListData.value.filter();
  const resp = await api.changeLabelPageApis.getPrintExpressPackageList(temp).catch(() => null);

  if (resp?.data?.isSuccess) {
    packageList.value = resp.data.Data;
    getPackageListData.value.total = resp.data.DataNumber;
  }
};

onMounted(async () => {
  getList();
});
</script>

<script lang="ts">
export default {
  name: 'OrderPackageListPage',
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
