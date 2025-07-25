<template>
  <section class="page-wrap" v-if="pageStore?.ruleForm">
    <Header :class="{ shadow: shadow.top }" :rowOrder="pageStore.rowItem" :ruleForm="pageStore.ruleForm" @typeChange="e=>pageStore?.onTypeChange(e)" />
    <main>
      <p ref="oMainPTop"></p>
      <!-- 组合生产线自身 -->
      <RightSetupPanelComp style="margin-left: 400px;margin-bottom: 25px;margin-top: 10px;"
        v-if="pageStore.ruleForm.Type === LineTypeEnum.combine && pageStore.ruleForm.CombineLineInstance"
        v-model="pageStore.ruleForm.CombineLineInstance" isCombine
        @workingChange="() => pageStore?.ruleForm?.onCombineWorkingChange()"
        :WorkingProcedures="pageStore.ruleForm.CombineLineInstance._lineData?.Detail.WorkingProcedures || []"
      />

      <!-- 实例列表：单一生产线实例|组合生产线半成品实例 -->
      <ul>
        <li v-for="(instance, i) in pageStore.ruleForm.InstanceList" :key="instance._key">
          <PDOLineInstanceComp v-model="pageStore.ruleForm.InstanceList[i]" :index="i" :ruleForm="pageStore.ruleForm" />
        </li>
      </ul>

      <!-- 半成品新增 -->
      <p v-if="pageStore.ruleForm.Type === LineTypeEnum.combine && pageStore.ruleForm._SemifinishedList?.length">
        <mp-button link type="primary" style="margin-top: 15px;" @click="onSemifinishedAddClick">添加半成品</mp-button>
        <SemifinishedSelectDialog v-model:visible="semiFState.visible" :list="semiFState.allList" :checkedIds="semiFState.checkedIds" @submit="onSemiFSubmit" />
      </p>

      <!-- 文件上传 -->
      <UploadFilesDialog v-model:visible="pageStore.ruleForm.uploader.visible" :fileList="pageStore.ruleForm.uploader.fileList" ref="oUploadDialog" />

      <p ref="oMainPBottom"></p>
    </main>

    <footer :class="{ shadow: shadow.bottom }">
      <mp-button class="blue" :disabled="pageStore.disabled" @click="onSaveClick(false)">保存并返回</mp-button>
      <mp-button type='primary' :disabled="pageStore.disabled" @click="onSaveClick(true)">下一步</mp-button>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { getGoBackFun } from '@/router';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { PDOSetupViewStore as pageStore } from './store/PDOSetupViewStore';
import Header from './components/Header.vue';
import PDOLineInstanceComp from './components/PDOLineInstanceComps/PDOLineInstanceComp.vue';
import UploadFilesDialog from './components/UploadFilesComp/UploadFilesDialog.vue';
import { clearRequestTempData } from './components/PDOLineInstanceComps/js/requestTempDataAndCatch';
import { useShadow } from './hooks/useShadow';
import RightSetupPanelComp from './components/PDOLineInstanceComps/RightSetupPanelComp.vue';
import SemifinishedSelectDialog from './components/SemifinishedSelectDialog.vue';
import { useSemifinishedSelect } from './hooks/useSemifinishedSelect';

const oUploadDialog = ref<InstanceType<typeof UploadFilesDialog>>();

const { shadow, oMainPTop, oMainPBottom } = useShadow();
const { semiFState, onSemifinishedAddClick, onSemiFSubmit } = useSemifinishedSelect(pageStore);

const onSaveClick = (bool: boolean) => {
  if (pageStore.value?.ruleForm && oUploadDialog.value) {
    pageStore.value.ruleForm.uploader.uploadCompRef = oUploadDialog.value;
  }

  pageStore.value?.save(bool);
};

onMounted(async () => {
  clearRequestTempData();

  await pageStore.value?.initial();
});

</script>

<script lang="ts">
export default {
  name: 'ProcessDecompositionOrderSetupView',
};
</script>

<style scoped lang='scss'>
.page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  > main {
    flex: 1;
    overflow: auto;
    padding: 0 20px;

    > :deep(.el-table) {
      height: 100%;
    }

    // display: flex;
    // flex-direction: column;
    // align-items: center;
  }
  > footer {
    height: 45px;
    padding: 15px 0 10px calc(50% - 200px);

    button {
      width: 120px;
      height: 35px;
      margin: 0 30px;
      &.el-button--primary {
        --el-button-disabled-bg-color: #ccc;
        --el-button-disabled-border-color: #cbcbcb;
      }
      &:not(.el-button--primary).is-disabled {
        border-color: #cbcbcb;
        color: #cbcbcb;
      }

      &:last-of-type {
        margin-left: calc(50% - 120px);

        @media screen and (max-width: 1550px) {
          margin-left: calc(50% - 180px);
        }
        @media screen and (max-width: 1450px) {
          margin-left: calc(50% - 220px);
        }
      }
    }
  }
  > header, > footer {
    flex: none;
  }
  > header, > main, > footer {
    background-color: #fff;
    // font-family: "Arial Negreta", "Arial Normal", Arial, sans-serif;
  }

  .shadow {
    position: relative;
    box-shadow: 0 0 20px rgba($color: #000000, $alpha: 0.2);
  }
}
</style>
