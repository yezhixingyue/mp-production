<template>
  <section class="page-wrap">
    <header>
      <MpBreadcrumb :list="BreadcrumbList" />
    </header>
    <main>
      <div class="skeleton" v-if="!handleExceptionClassData.TaskExceptionDetail">
        <el-skeleton :rows="8" animated style="width: 410px;margin-right: 160px;" />
        <el-skeleton :rows="5" animated style="width: 600px" />
      </div>
      <template v-else>
        <LeftDetailTable :TaskExceptionDetail="handleExceptionClassData.TaskExceptionDetail" :IsOutSourcing="IsOutSourcing" />
        <CenterHandlerComp :handleExceptionRuleForm="handleExceptionClassData.ruleForm" :TaskExceptionDetail="handleExceptionClassData.TaskExceptionDetail" />
        <RightExternalHandler v-if="handleExceptionClassData.ruleForm.ExternalFactory"
          :class="{
            'v-hide': handleExceptionClassData.ruleForm.SolveType === SolveTypeEnum.continue,
            'v-part-hide': handleExceptionClassData.ruleForm.SolveType === SolveTypeEnum.rollbackBeforeMakeup
          }"
          :ExternalRuleForm="handleExceptionClassData.ruleForm.ExternalFactory"
        />
      </template>
    </main>
    <footer>
      <mp-button type="primary" class="gradient" @click="submit">保存</mp-button>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { getGoBackFun } from '@/router';
import { handleExceptionRowDataStore } from '../js/store';
import { HandleExceptionClass } from './js/HandleExceptionClass';
import LeftDetailTable from './Comps/LeftDetailTable/LeftDetailTable.vue';
import CenterHandlerComp from './Comps/CenterHandlerComp/CenterHandlerComp.vue';
import RightExternalHandler from './Comps/RightExternalHandler/RightExternalHandler.vue';
import { SolveTypeEnum } from './js/enum';

const props = withDefaults(defineProps<{
  IsOutSourcing?: boolean // 是否为外协异常
}>(), {
  IsOutSourcing: false,
});

const BreadcrumbList = computed(() => [
  { to: { path: props.IsOutSourcing ? '/OutsourceExceptionList' : '/ProductionExceptionList' }, name: props.IsOutSourcing ? '外协异常' : '生产异常' },
  { name: '异常处理' },
]);

/** 异常任务处理类 */
const handleExceptionClassData = ref(new HandleExceptionClass(props.IsOutSourcing, handleExceptionRowDataStore.getData(props.IsOutSourcing)));

const submit = () => {
  handleExceptionClassData.value.submit();
};

onMounted(() => {
  handleExceptionClassData.value.getTaskExceptionDetail();
});
</script>

<style scoped lang='scss'>
.page-wrap {
  background-color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  > header {
    height: 20px;
    padding-bottom: 20px;
  }
  > main {
    flex: 1;
    overflow: hidden;
    display: flex;
    .skeleton {
      display: flex;
      padding-top: 5px;
    }

    > .column {
      height: 100%;
      overflow: auto;
      overflow: overlay;

      & + .column {
        border-left: 1px solid #d9d9d9;
      }

      &.v-hide {
        visibility: hidden;
      }
    }
  }
  > footer {
    text-align: center;
    padding: 40px 0 20px;
    .mp-button {
      width: 120px;
      height: 35px;
      border-radius: 4px;
      & + .mp-button {
        margin-left: 30px;
      }
    }
  }
  > header, > footer {
    flex: none;
  }
}
</style>
