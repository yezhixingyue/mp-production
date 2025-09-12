<template>
  <section class="mp-prod-manage-combine-task-print-list-page-wrap">
    <Header :localManageData="localManageData" />

    <main>
      <Table :list="localManageData.list" :loading="localManageData.loading" :Permission="user?.PermissionList.PermissionManageUnionTask" @view="onViewClick" />

      <!-- 查看详情与打印 -->
      <DetailDialog v-model:visible="visible" :row="row" />
    </main>

    <footer>
      <MpPagination center :nowPage="localManageData.condition.Page" :pageSize="localManageData.condition.PageSize" :total="localManageData.listNumber"
        :handlePageChange="(page) => localManageData.getList(page)" />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import MpPagination from '@/components/common/MpPagination.vue';
import { ManageCombineTaskPrintListModel } from './models/ManageCombineTaskPrintListModel';
import Header from './components/Header.vue';
import Table from './components/Table.vue';
import DetailDialog from './components/DetailDialog/DetailDialog.vue';
import { IUnionTaskTrackInfo } from './types/type';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const localManageData = ref(new ManageCombineTaskPrintListModel());

const row = ref<IUnionTaskTrackInfo | null>(null);
const visible = ref(false);
const onViewClick = (e) => {
  row.value = e;
  visible.value = true;
};

onMounted(() => {
  localManageData.value.init();
});
</script>

<script lang="ts">
export default {
  name: 'CombineTaskPrintListPage',
};
</script>

<style scoped lang='scss'>
.mp-prod-manage-combine-task-print-list-page-wrap {
  height: 100%;
  background-color: #fff;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr 50px;

  > main {
    padding-left: 30px;
    padding-right: 20px;
    overflow: hidden;
  }

  > footer {
    padding-top: 10px;

    :deep(> section.mp--pagination) {
      > .count {
        margin-right: 20px;
        text-align: right;
        min-width: 100px;
      }
    }
  }
}
</style>
