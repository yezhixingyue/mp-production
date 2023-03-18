<template>
  <main>
    <el-table :data="localList" border stripe class="table-wrap">
      <mp-table-column width="100px" prop="TaskCode" label="任务ID" />
      <mp-table-column width="120px" prop="TargetCode" label="关联ID" />
      <mp-table-column min-width="120px" prop="TaskDetail" label="任务详情" />
      <mp-table-column width="100px" prop="_Number" label="加工数量" />
      <mp-table-column min-width="160px" prop="_WorkingContent" :label="IsOutSourcing ? '工序（外协工厂）' : '工序（设备）'" />
      <mp-table-column min-width="140px" prop="Remark" label="情况说明" />
      <mp-table-column width="185px" prop="_SubmitContent" label="提交时间（提交人）" />
      <mp-table-column width="150px" label="状态">
        <template #default="scope">
          <span v-if="scope.row._processed" class="mr-10">已处理</span>
          <mp-button type="primary" v-if="scope.row._processed" link @click="onMenuClick(scope.row, 'Detail')">处理详情</mp-button>
        </template>
      </mp-table-column>
      <mp-table-column width="185px" prop="_HandlerContent" label="处理时间（处理人）" />
      <mp-table-column width="120px" label="操作">
        <template #default="scope">
          <mp-button type="primary" v-if="!scope.row._processed" link @click="onMenuClick(scope.row, 'Setup')">处理</mp-button>
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
import { ITaskExceptionInfo } from '../../js/type';
import { ExceptionHandlerStatusEnum } from '../../js/enum';
import { TargetTypeEnumList } from '../../SetupView/js/EnumList';

const props = defineProps<{
  list: ITaskExceptionInfo[]
  loading: boolean
  IsOutSourcing: boolean
}>();

const emit = defineEmits(['jump']);

const localList = computed(() => {
  const list = props.list.map(it => ({
    ...it,
    _Number: it.Number || it.Number === 0 ? `${`${it.Number}`.replace(/(?=(\B)(\d{3})+$)/g, ',')}${it.Unit || ''}` : '',
    /** 关联ID */
    _CorrelationContent: `${it.TargetCode}(${getEnumNameByID(it.TargetType, TargetTypeEnumList).replace('报工', '')})`,
    _SubmitContent: `${format2MiddleLangTypeDateFunc2(it.CreateTime)}（${it.SubmitterName}）`,
    _HandlerContent: it.HandlerTime ? `${format2MiddleLangTypeDateFunc2(it.HandlerTime)}（${it.HandlerName}）` : '',
    /** 是否已处理 */
    _processed: it.Status !== ExceptionHandlerStatusEnum.unprocessed,
    /** 工序(外协工厂) */
    _WorkingContent: it.Working + (it.Equipment ? ` (${it.Equipment.Name})` : ''),
  }));

  return list;
});

const onMenuClick = (row: ITaskExceptionInfo, type: 'Detail' | 'Setup') => {
  emit('jump', row, type);
};

</script>

<style scoped lang='scss'>
.table-wrap {
  :deep(.el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell) {
    height: 44px;

    button {
      font-size: 12px;
    }
  }
}
</style>
