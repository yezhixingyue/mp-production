<template>
  <main>
    <el-table :data="list" border stripe class="table-wrap" @selection-change="handleSelectionChange" ref="multipleTableRef">
      <el-table-column type="selection" width="42" :selectable="(row: ISchedulingExceptionListItem) => !row.DealTime" />
      <mp-table-column width="120px" prop="ID" label="序号" />
      <mp-table-column width="120px" prop="_Type" label="异常类型" />
      <mp-table-column width="120px" prop="Code" label="编号" />
      <!-- '情况说明'列 如果需要靠左对齐时，在下面行上添加右侧属性以设置列的类名： class-name="content" -->
      <mp-table-column min-width="150px" prop="Content" label="情况说明" />
      <mp-table-column width="150px" prop="_CreateTime" label="异常时间" />
      <mp-table-column width="120px" prop="_HaveDeal" label="处理状态" />
      <mp-table-column width="200px" prop="_DealContent" label="处理时间（处理人）" />
      <mp-table-column width="150px" label="操作">
        <template #default="scope:{ row: ISchedulingExceptionListItem }">
          <mp-button type="primary" v-if="!scope.row.DealTime" link @click="onDealClick(scope.row)">标记为已处理</mp-button>
        </template>
      </mp-table-column>
      <template #empty>
        <span class="ft-12" v-show="!loading">暂无数据</span>
      </template>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { ElTable } from 'element-plus';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ISchedulingExceptionListItem } from '../js/type';

defineProps<{
  list: ISchedulingExceptionListItem[]
  loading: boolean
}>();

const emit = defineEmits(['setHaveDeal', 'select', 'setTableRef']);

const onDealClick = (row: ISchedulingExceptionListItem) => {
  MpMessage.warn('确定标记为已处理吗 ?', `编号：[ ${row.Code} ]`, () => {
    emit('setHaveDeal', row);
  });
};

const multipleTableRef = ref<InstanceType<typeof ElTable>>();

const handleSelectionChange = async (val: ISchedulingExceptionListItem[]) => {
  emit('select', val, multipleTableRef.value || null);
};

onMounted(() => {
  emit('setTableRef', multipleTableRef.value || null);
});
</script>

<style scoped lang='scss'>
.table-wrap {
  :deep(th.content.is-leaf.el-table__cell) {
    text-align: left;
    padding-left: 10px;
  }
  :deep(.el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell) {
    height: 44px;

    .cell {
      padding: 0 8px;
    }

    button {
      font-size: 12px;
    }

    &.content {
      text-align: left;
      padding-left: 12px;
      color: #585858;
    }

    --el-fill-color-light: #eee;
  }
}
</style>
