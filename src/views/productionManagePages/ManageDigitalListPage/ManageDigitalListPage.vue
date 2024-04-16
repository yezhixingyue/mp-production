<template>
  <section class="mp-erp-manage-digital-list-page-wrap">
    <Header :localManageData="localManageData" />

    <main>
      <Table :localManageData="localManageData" />

      <PrintArea ref="oPrintDialog" onlyPrint>
        <PrintListArea :list="printDataList" />
      </PrintArea>
    </main>

    <footer>
      <mp-button type="primary" class="linear" :disabled="!localManageData.Selection.length" @click="print"
        >打印选中大版工单</mp-button>
      <MpPagination center :nowPage="localManageData.condition.Page" :pageSize="localManageData.condition.PageSize" :total="localManageData.listNumber"
        :handlePageChange="(page) => localManageData.getList(page)" />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { Ref, onMounted, ref } from 'vue';
import MpPagination from '@/components/common/MpPagination.vue';
import PrintArea from '@/components/common/General/Print/PrintDialog.vue';
import { ManageDigitalListClass } from './js/ManageDigitalListClass';
import Header from './components/Header.vue';
import Table from './components/Table.vue';
import PrintListArea from './components/print/PrintListArea.vue';
import { ILocalDigitalOrderPlatePrintInfoWithQrCode } from './js/types';

const localManageData = ref(new ManageDigitalListClass()) as Ref<ManageDigitalListClass>;

const oPrintDialog = ref<InstanceType<typeof PrintArea>>();

const printDataList = ref<ILocalDigitalOrderPlatePrintInfoWithQrCode[]>([]);

const print = async () => {
  printDataList.value = [];

  const list = await localManageData.value.requestPrint();
  if (!list) return;

  console.log('list', list);
  printDataList.value = list;
  oPrintDialog.value?.print();
};

onMounted(() => {
  localManageData.value.init();
});

</script>

<script lang="ts">
export default {
  name: 'ManageDigitalListPage',
};
</script>

<style scoped lang='scss'>
.mp-erp-manage-digital-list-page-wrap {
  height: 100%;
  background-color: #fff;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr 80px;

  > main {
    padding-left: 20px;
    padding-right: 40px;
    overflow: hidden;
  }

  > footer {
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 60px;
    display: flex;
    button {
      border-radius: 4px;
      width: 150px;
    }

    > section {
      height: 36px;
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
