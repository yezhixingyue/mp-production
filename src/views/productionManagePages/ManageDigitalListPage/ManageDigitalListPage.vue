<template>
  <section class="mp-erp-manage-digital-list-page-wrap">
    <Header :localManageData="localManageData" />

    <main>
      <Table :localManageData="localManageData" :Permission="user?.PermissionList.PermissionManageDigitalPlate" />

      <PrintArea ref="oPrintDialog" onlyPrint>
        <PrintListArea :list="printDataList" />
      </PrintArea>
    </main>

    <footer>
      <mp-button type="primary" class="linear" :disabled="!localManageData.Selection.length" @click="print(true)"
       v-if="user?.PermissionList.PermissionManageDigitalPlate.Obj.Print"
        >打印选中大版工单</mp-button>
      <mp-button type="primary" class="linear" :disabled="!localManageData.Selection.length" @click="print(false)"
       v-if="user?.PermissionList.PermissionManageDigitalPlate.Obj.Preview"
        >查看选中大版工单</mp-button>
      <MpPagination center :nowPage="localManageData.condition.Page" :pageSize="localManageData.condition.PageSize" :total="localManageData.listNumber"
        :ExportExcelProps="downloadExcelObj" :handlePageChange="(page) => localManageData.getList(page)" />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { Ref, computed, onMounted, ref } from 'vue';
import MpPagination from '@/components/common/MpPagination.vue';
import PrintArea from '@/components/common/General/Print/PrintDialog.vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { ManageDigitalListClass } from './js/ManageDigitalListClass';
import Header from './components/Header.vue';
import Table from './components/Table.vue';
import PrintListArea from './components/print/PrintListArea.vue';
import { ILocalDigitalOrderPlatePrintInfoWithQrCode } from './js/types';

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

const localManageData = ref(new ManageDigitalListClass()) as Ref<ManageDigitalListClass>;

const oPrintDialog = ref<InstanceType<typeof PrintArea>>();

const printDataList = ref<ILocalDigitalOrderPlatePrintInfoWithQrCode[]>([]);

const print = async (IsPrint: boolean) => {
  printDataList.value = [];

  const list = await localManageData.value.requestPrint(IsPrint);
  if (!list) return;

  printDataList.value = list;
  oPrintDialog.value?.print();
};

const downloadExcelObj = computed(() => (user.value?.PermissionList.PermissionManageDigitalPlate.Obj.Excel ? {
  apiPath: 'getOfflinePlateExcel',
  fileName: '数码工单',
  getCondition: () => localManageData.value.condition.filter(),
  getFileNameDate: () => ({
    First: localManageData.value.condition.CreateTime.First,
    Second: localManageData.value.condition.CreateTime.Second,
  }),
} : undefined));

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
