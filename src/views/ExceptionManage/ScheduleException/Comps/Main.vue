<template>
  <main>
    <el-table :data="localList" border stripe class="table-wrap">
      <mp-table-column width="120px" prop="Code" label="编号" />
      <mp-table-column width="120px" prop="_Type" label="异常类型" />
      <mp-table-column width="150px" prop="_CreateTime" label="异常时间" />
      <!-- '情况说明'列 如果需要靠左对齐时，在下面行上添加右侧属性以设置列的类名： class-name="content" -->
      <mp-table-column min-width="150px" prop="Content" label="情况说明" />
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
import { computed } from 'vue';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ISchedulingExceptionListItem } from '../js/type';
import { SchedulingExceptionTypeEnumList } from '../js/EnumList';

const props = defineProps<{
  list: ISchedulingExceptionListItem[]
  loading: boolean
}>();

const emit = defineEmits(['setHaveDeal']);

const localList = computed(() => {
  const list = props.list.map(it => ({
    ...it,
    _Type: getEnumNameByID(it.Type, SchedulingExceptionTypeEnumList),
    _CreateTime: format2MiddleLangTypeDateFunc2(it.CreateTime),
    _HaveDeal: it.DealTime ? '已处理' : '未处理',
    _DealContent: `${format2MiddleLangTypeDateFunc2(it.DealTime)}${it.Operator ? ` （${it.Operator?.Name}）` : ''}`,
  }));

  return list;
});

const onDealClick = (row: ISchedulingExceptionListItem) => {
  MpMessage.warn('确定标记为已处理吗 ?', `编号：[ ${row.Code} ]`, () => {
    emit('setHaveDeal', row);
  });
};

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
  }
}
</style>
