<template>
  <section class="procesisng-machinery-page-wrap">
    <Header />
  </section>
</template>

<script setup lang='ts'>
import Header from '@/components/productionResources/procesisngMachinery/ProcesisngMachineryHeader.vue';
</script>

<script lang='ts'>
export default {
  name: 'procesisngMachineryManagePage',
};
</script>

<style scoped lang='scss'>
.procesisng-machinery-page-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    height: 70px;
    margin-bottom: 10px;
    padding: 0 20px;
    box-sizing: border-box;
    justify-content: space-between;
    > :deep(.el-button) {
      width: 130px;
      height: 30px;
      border-radius: 3px;
    }
  }
  > main {
    flex: 1;
    overflow: hidden;
    > :deep(.el-table) {
      height: 100%;
      .el-button.is-link {
        font-size: 12px;
      }
    }
  }
  > footer {
    height: 50px;
  }

  > header, > footer {
    flex: none;
    display: flex;
    align-items: center;
  }
  > header, > footer, > main {
    background-color: #fff;
  }
}
</style>
