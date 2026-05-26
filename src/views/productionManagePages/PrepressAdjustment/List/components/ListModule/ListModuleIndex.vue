<template>
  <section class="adjust-module-page-wrap">
    <Header :moduleData="moduleData" :type="type" :Permission="Permission" @addNumber="onAddNumberClick" />

    <main>
      <Table :list="moduleData.list" :loading="moduleData.loading" :type="type" :Permission="Permission"
       @advEnter="onAdvEnterClick"
       @cancelAdv="e => moduleData.cancelAdv(e)"
       @removeAdd="e => moduleData.removeAdd(e)"
       />

      <AdvEnterDialog v-model:visible="advEnterVisible" :item="advEnterItem" @submit="submitAdvEnter" />

      <AddNumberDialog v-model:visible="addNumberVisible" @submit="submitAddNumber" />
    </main>

    <footer>
      <MpPagination center :nowPage="moduleData.condition.Page" :pageSize="moduleData.condition.PageSize" :total="moduleData.listNumber"
      :handlePageChange="moduleData.getList.bind(moduleData)" />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { AdjustListManageModel } from '../../model/AdjustListManageModel';
import Header from './components/Header.vue';
import Table from './components/Table.vue';
import { useAdvEnterDialog } from './hooks/useAdvEnterDialog';
import AdvEnterDialog from './components/AdvEnterDialog.vue';
import { AdjustTabTypeEnum } from '../../../types/enum';
import { useAddNumberDialog } from './hooks/useAddNumberDialog';
import AddNumberDialog from './components/AddNumberDialog.vue';
import { PrepressAdjustmentManageModel } from '../../../model/PrepressAdjustmentManageModel';

const props = defineProps<{
  type: AdjustTabTypeEnum
  moduleData: AdjustListManageModel
  Permission: PrepressAdjustmentManageModel['Permission']
}>();

const { advEnterVisible, advEnterItem, onAdvEnterClick, submitAdvEnter } = useAdvEnterDialog(props);

const { addNumberVisible, onAddNumberClick, submitAddNumber } = useAddNumberDialog(props);

</script>

<style scoped lang='scss'>
.adjust-module-page-wrap {
  padding: 20px 20px 0 20px;
  height: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr 50px;

  > main {
    padding-top: 20px;
    overflow: hidden;

    > :deep(.el-table) {
      height: 100%;
    }
  }

  > footer {
    padding-top: 7px;
  }
}
</style>
