<template>
  <el-table :data="localList" border stripe class="table-wrap">
    <mp-table-column width="100px" prop="Code" label="任务ID" />
    <mp-table-column width="120px" prop="TargetCode" :label="IsPlateTask? '版ID' : '订单ID'" />
    <mp-table-column width="85px" prop="Index" label="操作次序" />
    <mp-table-column min-width="80px" prop="Material" label="物料" />
    <mp-table-column width="120px" prop="Working" label="工序" />
    <mp-table-column min-width="100px" prop="WorkingNote" label="加工信息" />
    <mp-table-column width="120px" prop="Equipment" label="设备" />
    <mp-table-column width="80px" prop="PrintSide" label="印面" />
    <mp-table-column width="80px" prop="_SideNumber" :label="IsPlateTask ? '印面数' : '订单总数'" />
    <mp-table-column width="80px" prop="_MaterialNumber" :label="IsPlateTask ? '印张数' : '任务数量'" />
    <mp-table-column width="80px" prop="_Wastage" label="申放数量" />
    <mp-table-column width="80px" prop="Operator" label="操作人" />
    <mp-table-column width="110px" prop="WishDuration" label="预计加工时长" />
    <mp-table-column width="110px" prop="ActualDuration" label="实际加工时长" />
    <mp-table-column width="130px" prop="_FinishTime" label="完成时间" />
    <template #empty>
      <span class="ft-12" v-show="!loading">暂无数据</span>
    </template>
  </el-table>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { IDigitalTask } from '../js/type';
import { ManagePageData } from '../js/ManagePageData';

const props = defineProps<{
  list: IDigitalTask[]
  loading: boolean
  IsPlateTask: ManagePageData['currentTab']
}>();

const localList = computed(() => props.list.map(it => ({
  ...it,
  _SideNumber: it.SideNumber ? `${it.SideNumber}${props.IsPlateTask ? '面' : it.Unit}` : '',
  _MaterialNumber: it.MaterialNumber ? `${it.MaterialNumber}${props.IsPlateTask ? '张' : it.Unit}` : '',
  _Wastage: it.Wastage ? `${it.Wastage}${props.IsPlateTask ? '张' : it.Unit}` : '',
  _FinishTime: format2MiddleLangTypeDateFunc2(it.FinishTime),
})));
</script>

<style scoped lang='scss'>
.table-wrap {
  height: 100%;
  :deep(.cell) {
    padding: 0 2px;
  }
  :deep(th.content.is-leaf.el-table__cell) {
    text-align: left;
    padding-left: 10px;
  }
  :deep(.el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell) {
    height: 44px;

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
