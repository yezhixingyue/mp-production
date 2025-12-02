<template>
  <section class="equip-assistant-page-wrap" v-if="localAssistantManageModel">
    <Header :localAssistantManageModel="localAssistantManageModel" @add="onItemUpsertClick" />
    <main>
      <Table :localAssistantManageModel="localAssistantManageModel" @edit="onItemUpsertClick" />

      <UpsertDialog v-model:visible="visible" :target="targetItem" :localAssistantManageModel="localAssistantManageModel" />
    </main>

    <footer>
      <MpPagination style="width:100%" center
        :nowPage="localAssistantManageModel.condition.Page"
        :pageSize="localAssistantManageModel.condition.PageSize"
        :total="localAssistantManageModel.listNumber"
        :handlePageChange="(e) => localAssistantManageModel?.getList(e)"
      />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted } from 'vue';
import MpPagination from '@/components/common/MpPagination.vue';
import Header from './components/Header.vue';
import Table from './components/Table.vue';
import UpsertDialog from './components/UpsertDialog.vue';
import { AssistantListManageModel } from './model/AssistantListManageModel';
import { useItemUpsert } from './hooks/useItemUpsert';
import { localAssistantManageModel } from './store';

localAssistantManageModel.value = new AssistantListManageModel();

const { visible, targetItem, onItemUpsertClick } = useItemUpsert(); // 新增|编辑

onMounted(() => {
  if (localAssistantManageModel.value) {
    localAssistantManageModel.value.getList();
    localAssistantManageModel.value.getAssistantTypeList();
  }
});
</script>

<script lang="ts">
export default {
  name: 'EquipmentAssistantManagePage',
};
</script>

<style scoped lang='scss'>
.equip-assistant-page-wrap {
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr 55px;

  > header, > main, > footer {
    background-color: #fff;
  }

  > main {
    overflow: hidden;
  }

  > footer {
    padding-top: 10px;
  }
}
</style>
