<template>
  <section v-if="localModel" class="panel">
    <header>
      <div class="menu">
        <span v-for="it in curFilterLineList" :key="it.ID" :class="{ active: it.ID === localModel.condition.LineID }"
          @click="() => localModel!.onLineClick(it.ID)">{{ it.Name }}</span>
      </div>

      <p class="remark"><el-icon><WarningFilled /></el-icon> 注：物料没有设置拼版人则所有人员均可见。</p>

      <SearchInputComp :word='localModel.condition.KeyWords' title="关键词搜索" placeholder="物料名称，拼版人"
        style="margin-left: 0;margin-top: 15px;"
        :changePropsFunc="(keywords: string) => localModel!.changeKeywords(keywords)"
        :requestFunc='() => {}' :searchWatchKey="localModel.list"
        :show-reset-btn="false"
        @reset='() => localModel!.clearCondition()' />
    </header>

    <main>
      <el-table :data="localModel.list" border stripe class="table-wrap" style="max-width: 1360px;height: 100%;">
        <mp-table-column min-width="260px" prop="MaterialName" label="物料名称" />
        <mp-table-column min-width="305px" prop="MemberNames" label="拼版人">
          <template #default="scope:{ row: ImpositionAllocationModel['list'][0] }">
            <template v-if="scope.row.MemberNames">{{ scope.row.MemberNames }}</template>
            <span v-else style="color: #7f7f7f;">- 所有人 -</span>
          </template>
        </mp-table-column>
        <mp-table-column min-width="160px" label="操作" class-name="ctrl" v-if="Permission?.Obj.ImpositionSetup">
          <template #default="scope:{ row: ImpositionAllocationModel['list'][0] }">
            <mp-button type="primary" class="ft-12" link :disabled="getDisabled(scope.row)" @click="showDialog(scope.row)">设置拼版人</mp-button>
          </template>
        </mp-table-column>
        <template #empty>
          <span class="ft-12" v-show="!localModel.loading">暂无数据</span>
        </template>
      </el-table>

      <Dialog v-model:visible="visible" :row="currentRow" @submitted="onSubmitted" />
    </main>

    <footer>
      <MpPagination center :nowPage="localModel.condition.Page" :pageSize="localModel.condition.PageSize" :total="localModel.filteredList.length"
      :handlePageChange="(e) => localModel!.condition.Page = e" />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import MpPagination from '@/components/common/MpPagination.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { PrepressAdjustmentManageModel } from '../../../model/PrepressAdjustmentManageModel';
import { ImpositionAllocationModel } from './model/ImpositionAllocationModel';
import Dialog from './components/Dialog.vue';
import { useDialogVisible } from './hooks/useDialogVisible';
import { IImpAllocationListItem } from './types/types';
import { localPrepressAdjModel } from '../../../store';

defineProps<{
  Permission: PrepressAdjustmentManageModel['Permission']
}>();

const curFilterLineList = computed(() => {
  const { ProductionLineList, allAuthorizedLineIDs } = localPrepressAdjModel.value;
  const list = ProductionLineList.map(it => ({ ID: it.ID, Name: it.Name })).filter(it => allAuthorizedLineIDs.includes(it.ID));
  // list.unshift({ ID: '', Name: '所有生产线' });

  return list;
});

const localModel = ref<null | ImpositionAllocationModel>(null);

const { visible, currentRow, showDialog } = useDialogVisible();

const getDisabled = (row: ImpositionAllocationModel['list'][0]) => {
  if (row.LineID && !localPrepressAdjModel.value.myAuthorizedLineIDs.includes(row.LineID)) {
    return true;
  }

  return false;
};

const onSubmitted = (data: IImpAllocationListItem) => {
  if (data) {
    localModel.value?.updateMemberList(data);
  }

  visible.value = false;
  ElMessage.success('设置成功');
};

onMounted(() => {
  localModel.value = new ImpositionAllocationModel();
  if (curFilterLineList.value.length > 0) {
    localModel.value.onLineClick(curFilterLineList.value[0].ID);
  }
});
</script>

<style scoped lang='scss'>
.panel {
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr 50px;

  > header {
    display: flex;
    flex-direction: column;

    >.menu {
      flex: none;
      white-space: wrap;
      max-width: 100%;
      margin-right: 43px;

      >span {
        display: inline-block;
        line-height: 28px;
        padding: 0 17px;
        box-shadow: 0 0 0 1px #e8e8e8;
        cursor: pointer;
        background-color: #f5f5f5;
        color: #444;
        transition: 0.15s ease-in-out;
        position: relative;

        &:hover {
          background-color: #eee;
        }

        &.active {
          color: #26bcf9;
          background-color: #fff;
          box-shadow: 0 0 0 1px #26bcf9;
          z-index: 2;
        }
      }
    }

    > .remark {
      color: #7f7f7f;
      margin-top: 15px;
      font-size: 13px;
      margin-bottom: -5px;

      > i {
        font-size: 16px;
        vertical-align: -3px;
        margin-right: 2px;
      }
    }
  }

  > main {
    margin-top: 20px;
  }

  > footer {
    padding-top: 7px;
  }
}
</style>
