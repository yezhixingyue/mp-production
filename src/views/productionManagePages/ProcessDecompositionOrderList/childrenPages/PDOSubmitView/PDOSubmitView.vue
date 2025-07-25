<template>
  <section class="page-wrap">
    <BasicDetailViewCompView v-if="PDOSetupViewStore" :detail="PDOSetupViewStore.detailData4Submit" :rowItem="PDOSetupViewStore.rowItem" showSubmit
     @submit="onSubmitClick" @back="onBackClick" />
  </section>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import BasicDetailViewCompView from '../_DetailViewComp/BasicDetailViewCompView.vue';
import { PDOSetupViewStore } from '../PDOSetupView/store/PDOSetupViewStore';

const onSubmitClick = () => {
  MpMessage.warn('确定提交该数据吗', '', () => {
    PDOSetupViewStore.value?.submit();
  });
};

const onBackClick = () => {
  PDOSetupViewStore.value?.back();
};

</script>

<script lang="ts">
export default {
  name: 'ProcessDecompositionOrderSubmitView',
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
    }
  }
  > footer {
    height: 40px;
    padding: 7px 0 3px 0;
  }
  > header, > footer {
    flex: none;
  }
  > header, > main, > footer {
    background-color: #fff;
  }
}
</style>
