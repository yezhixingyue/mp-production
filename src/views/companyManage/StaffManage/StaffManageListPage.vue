<template>
  <section class="wrap">
    <Header :StaffManagePageData="StaffManagePageData" />
    <Main :StaffManagePageData="StaffManagePageData" />
    <footer>
      <MpPagination style="width:100%" center
        :nowPage="StaffManagePageData.condition.Page"
        :pageSize="StaffManagePageData.condition.PageSize"
        :total="StaffManagePageData.dataNumber"
        :handlePageChange="(e) => StaffManagePageData.getDataList(e)" />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { useCompanyStore } from '@/store/modules/companyManage';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import MpPagination from '@/components/common/MpPagination.vue';
import Header from './Comps/StaffListHeader.vue';
import Main from './Comps/StaffListMain.vue';

const companyStore = useCompanyStore();

const { StaffManagePageData } = storeToRefs(companyStore);

onMounted(() => {
  StaffManagePageData.value.getDataList();
  StaffManagePageData.value.getJobPostList();
});
</script>

<script lang="ts">
export default {
  name: 'StaffManageListPage',
};
</script>

<style scoped lang='scss'>
.wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  > header {
    flex: none;
  }
  > main {
    flex: 1;
    margin-top: 10px;
  }
  > footer {
    flex: none;
    height: 50px;
    box-sizing: border-box;
    padding-top: 5px;
  }
  > header, > main, > footer {
    background-color: #fff;
  }
}
</style>
