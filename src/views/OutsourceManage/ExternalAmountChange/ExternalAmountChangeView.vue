<template>
  <section class="page-wrap">
    <Header :localPageData="localPageData" :localPermission='localPermission' />

    <main>
      <Table :localPageData="localPageData" :localPermission='localPermission' :user="user" />
    </main>

    <Footer :listManager="localPageData.listManager" :localPermission='localPermission' />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref, computed } from 'vue';
import { useUserHook } from '@/store/modules/user';
import { PageMoudleManageClass } from './model/PageMoudleManageClass';
import Header from './components/Header.vue';
import Table from './components/Table.vue';
import Footer from './components/Footer/Footer.vue';

const localPageData = ref(new PageMoudleManageClass());

const { user } = useUserHook();
const localPermission = computed(() => user.value?.PermissionList.PermissionTaskChangePrice.Obj);

onMounted(() => {
  localPageData.value.init();
});
</script>

<script lang="ts">
export default {
  name: 'ExternalAmountChangeView',
};
</script>

<style scoped lang='scss'>
.page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;

  > header {
    flex: none;
    background-color: #fff;
  }

  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 8px;
    overflow: hidden;
    > :deep(.el-table) {
      height: 100%;
      margin-top: 0;
    }
  }

  :deep(> footer) {
    flex: none;
    background-color: #fff;
    height: 55px;
    box-sizing: border-box;
    padding: 5px 0 3px 20px;

    display: flex;
    align-items: center;

    > button {
      flex: none;
      width: 150px;
    }

    > div {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
