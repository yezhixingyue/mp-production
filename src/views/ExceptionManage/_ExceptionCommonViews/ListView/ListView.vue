<template>
  <section class="page-wrap" v-if = ManageListData.condition>
    <Header
      :condition="ManageListData.condition"
      :setCondition="ManageListData.condition.setConditon.bind(ManageListData.condition)"
      :clearCondition="ManageListData.clearCondition.bind(ManageListData)"
      :getList="ManageListData.getList.bind(ManageListData)"
      :list="ManageListData.list"
    />
    <Main :list="ManageListData.list" :loading="ManageListData.loading" :IsOutSourcing="IsOutSourcing" @jump="handleJump" />
    <Footer :condition="ManageListData.condition" :total="ManageListData.listNumber" :getList="ManageListData.getList.bind(ManageListData)" />
  </section>
</template>

<script setup lang='ts'>
import { onActivated, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Header from './Comps/Header.vue';
import Main from './Comps/Main.vue';
import Footer from './Comps/Footer.vue';

import { ManageListClass } from '../js/ManageListClass';
import { ITaskExceptionInfo } from '../js/type';
import { handleExceptionRowDataStore } from '../js/store';
import { ExceptionHandlerStatusEnum } from '../js/enum';

const router = useRouter();

const props = withDefaults(defineProps<{
  IsOutSourcing?: boolean // 是否为外协异常
}>(), {
  IsOutSourcing: false,
});

const ManageListData = ref(new ManageListClass(props.IsOutSourcing));

const handleJump = (row: ITaskExceptionInfo, type: 'Detail' | 'Setup') => {
  handleExceptionRowDataStore.setData(row, props.IsOutSourcing);
  const name = props.IsOutSourcing ? `OutsourceException${type}` : `ProductionException${type}`;
  router.push({ name });
};

onMounted(() => { ManageListData.value.getList(); });

onActivated(() => {
  const row = handleExceptionRowDataStore.getData(props.IsOutSourcing);
  if (row) {
    const t = ManageListData.value.list.find(it => it.ID === row.ID);
    if (t && t.Status === ExceptionHandlerStatusEnum.unprocessed && t.Status !== row.Status) {
      const _t = t;
      _t.Status = row.Status;
      _t.HandlerName = row.HandlerName;
      _t.HandlerTime = row.HandlerTime;
    }
    handleExceptionRowDataStore.setData(null, props.IsOutSourcing);
  }
});
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
