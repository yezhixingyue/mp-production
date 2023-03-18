<template>
  <section class="page-wrap">
    <header>
      <MpBreadcrumb :list="BreadcrumbList" />
    </header>
    <main>
      <template v-if="localExceptionHandleDetailClass.handleDetailData">
        <LeftDetailTable :TaskExceptionDetail="localExceptionHandleDetailClass.handleDetailData" :IsOutSourcing="IsOutSourcing" />
        <HandleDetailComp :handleDetailData="localExceptionHandleDetailClass.handleDetailData" :IsOutSourcing="IsOutSourcing" />
      </template>
    </main>
    <footer>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>import { getGoBackFun } from '@/router';
import { computed, onMounted, ref } from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { handleExceptionRowDataStore } from '../js/store';
import { ExceptionHandleDetailClass } from './js/ExceptionHandleDetailClass';
import LeftDetailTable from '../SetupView/Comps/LeftDetailTable/LeftDetailTable.vue';
import HandleDetailComp from './Comps/HandleDetailComp.vue';

const props = withDefaults(defineProps<{
  IsOutSourcing?: boolean // 是否为外协异常
}>(), {
  IsOutSourcing: false,
});

const BreadcrumbList = computed(() => [
  { to: { path: props.IsOutSourcing ? '/OutsourceExceptionList' : '/ProductionExceptionList' }, name: props.IsOutSourcing ? '外协异常' : '生产异常' },
  { name: '处理详情' },
]);

/** 异常任务处理类 */
const localExceptionHandleDetailClass = ref(new ExceptionHandleDetailClass(props.IsOutSourcing, handleExceptionRowDataStore.getData(props.IsOutSourcing)));

onMounted(() => {
  localExceptionHandleDetailClass.value.getTaskExceptionDetail();
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
