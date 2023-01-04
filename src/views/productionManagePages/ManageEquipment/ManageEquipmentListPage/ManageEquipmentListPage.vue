<template>
  <section class="page-wrap">
    <Header
      :condition="ManageEquipmentListPageData.condition"
      :EquipmentClassAndGroupLevelList="ManageEquipmentListPageData.EquipmentClassAndGroupLevelList"
      :getList="getList" />
    <Main
      :list="ManageEquipmentListPageData.list"
      :loading="ManageEquipmentListPageData.loading"
      :EquipmentClassList="ManageEquipmentListPageData.EquipmentClassList"
      :EquipmentGroupList="ManageEquipmentListPageData.EquipmentGroupList"
      @unbind="handleUnbind" @switchIsOpen="handleSwitchIsOpen" @setTime="onTimeSetupClick" />
    <Footer :condition="ManageEquipmentListPageData.condition" :getList="getList" :total="ManageEquipmentListPageData.listNumber" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from './Comps/Header.vue';
import Main from './Comps/Main.vue';
import Footer from './Comps/Footer.vue';
import { ManageEquipmentListClass } from './js/ManageEquipmentListClass';
import { IManageEquipmentInfo, IManageEquipmentTableListItem } from './js/types';
import { ManageEquipmentListPageData } from '../js/store';

const router = useRouter();

const getList = () => { ManageEquipmentListPageData.value.getList(); };

const handleUnbind = (item: IManageEquipmentInfo) => { ManageEquipmentListClass.handleItemUnbind(item); }; // 解绑

const handleSwitchIsOpen = (item: IManageEquipmentInfo) => { ManageEquipmentListClass.handleItemSwitchOpen(item); }; // 开关机

const onTimeSetupClick = (item: IManageEquipmentTableListItem) => {
  ManageEquipmentListPageData.value.curEditItem = item;
  router.push('/ManageEquipmentRunTime');
};

onMounted(() => { ManageEquipmentListPageData.value.getInitData(); });
</script>

<script lang="ts">
export default {
  name: 'ManageEquipmentListPage',
};
</script>

<style scoped lang='scss'>
.page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  > header {
    padding: 20px 5px;
  }
  > main {
    flex: 1;
    margin-top: 8px;
    overflow: hidden;
    > :deep(.el-table) {
      height: 100%;
      .el-button.is-link {
        font-size: 12px;
      }
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
