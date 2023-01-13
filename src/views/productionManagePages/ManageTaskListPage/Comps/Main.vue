<template>
  <main>
    <el-table :data="localList" border stripe class="table-wrap">
      <mp-table-column width="105px" prop="Code" label="任务ID" />
      <mp-table-column width="140px" prop="_RelationID" label="关联ID" />
      <mp-table-column width="100px" prop="_Index" label="操作次序" />
      <mp-table-column min-width="160px" prop="Content" label="内容" />
      <mp-table-column min-width="160px" prop="Material" label="物料" />
      <mp-table-column width="110px" prop="_Number" label="数量" />
      <mp-table-column min-width="160px" prop="ProcessInformation" label="加工信息" class-name="red" />
      <mp-table-column width="180px" prop="_EquipmentAndOperator" label="设备(操作人)" />
      <mp-table-column width="120px" prop="_WishDuration" label="预计加工时长" />
      <mp-table-column width="120px" prop="_ActualDuration" label="实际加工时长" class-name="cyan" />
      <mp-table-column width="130px" prop="_FinishTime" label="完成时间" />
      <template #empty>
        <span class="ft-12" v-show="!loading">暂无数据</span>
      </template>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { getEnumNameByIDAndEnumList } from '@/assets/js/utils/getListByEnums';
import { ReportModeEnumList } from '@/views/productionSetting/process/enums';
import { format2LangTypeDate } from '@/assets/js/filters/dateFilters';
import { IManageTaskListItem } from '../js/type';

const props = defineProps<{
  list: IManageTaskListItem[]
  loading: boolean
}>();

const localList = computed(() => {
  const getTime = (duration: number) => {
    const hour = Math.floor(duration / 60);
    const minute = duration % 60;

    return `${hour ? `${hour}小时` : ''}${minute}分钟`;
  };
  const list = props.list.map(it => ({
    ...it,
    _RelationID: `${it.RelationID}(${getEnumNameByIDAndEnumList(it.Type, ReportModeEnumList).replace('订单', '')})`,
    _Index: it.Index ? `第${it.Index}次` : '',
    _Number: it.Number || it.Number === 0 ? `${`${it.Number}`.replace(/(?=(\B)(\d{3})+$)/g, ',')}${it.Unit || ''}` : '',
    _EquipmentAndOperator: `${it.Equipment || ''}${it.Operator ? `(${it.Operator})` : ''}`,
    _WishDuration: getTime(it.WishDuration),
    _ActualDuration: getTime(it.ActualDuration),
    _FinishTime: format2LangTypeDate(it.FinishTime),
  }));

  return list;
});
</script>

<style scoped lang='scss'>
.table-wrap {
  :deep(.el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell) {
    height: 44px;
    &.red {
      .cell {
        color: #ff0000;
      }
    }
    &.cyan {
      .cell {
        color: #4B7902;
      }
    }
  }
}
</style>
